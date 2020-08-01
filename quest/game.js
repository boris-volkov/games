	//------------------------------------------------------Global Flags
	//TODO these can probably be collapsed into one
	var ready = false;
	var between_games = false;

	//------------------------------------Initialization of progress bar	
	var canvas = document.getElementById('progress_bar');
	var context = canvas.getContext('2d');

	const urlParams = new URLSearchParams(window.location.search);
	var mins = urlParams.get('mins');
	var debug = urlParams.get('debug');
	if (isNaN(parseInt(mins))) mins = 5;
	else mins = parseInt(mins);
	var TIME_LIMIT = 1000 * 60 * mins;

	//-------------------------------------------------------Progress Bar Stuff
	var START_TIME = -1; // temporarily negative before game starts	

	function computeDecimalFull(time) {
		if (START_TIME < 0) return 0;
		return Math.min(1, (time - START_TIME)/TIME_LIMIT);
	}
	let color1 = '#4499EE';
	let color2 = '#255585';
	function progress_bar(){
		const decimalFull = computeDecimalFull(Date.now());
		const widthFull = decimalFull*canvas.width;
		context.fillStyle = color1;
		context.fillRect(0,0, widthFull, canvas.height);
		context.fillStyle = color2;
		context.fillRect(widthFull, 0, canvas.width-widthFull, canvas.height);
		if (debug == '1'){
			context.fillStyle = '#000';
			context.fillText(level.toString(),10,10);
		}
	}

	function isTimeOut() { return START_TIME + TIME_LIMIT < Date.now();}

	window.addEventListener("resize", draw_canvas);
	const PROGRESS_BAR_SCALE = 1.1;
	function draw_canvas(){ //rename to resize?
		var context = canvas.getContext('2d');
		canvas.setAttribute('width', window.innerWidth-30); 
		//canvas.setAttribute('height', window.innerHeight*PROGRESS_BAR_SCALE);//TODO
		canvas.setAttribute('height', 100);
		canvas.width = canvas.width; canvas.height = canvas.height;
		progress_bar();
	}
	const NUM_COLS = 16;
	const NUM_ROWS = 4;
	const digits = "0123456789";
	var level = 1;
	var quest_start;
	
	var quest = {}; // "object oriented programming"

	// random normally distributed variable: sd=1 mean=0
	function randn_bm() {
	    var u = 0, v = 0;
	    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	    while(v === 0) v = Math.random();
	    return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
	}	

	//TODO color code the op chars?
	function generate_add(level){
		quest.a 	= Math.abs(Math.round(level + level/2*randn_bm()));
		quest.b 	= Math.abs(Math.round(level + level/2*randn_bm()));
		quest.ans 	= quest.a + quest.b;
		quest.op 			= '+';
		generate_prompt();
	}

	function generate_mul(level){
		quest.a 	= Math.abs(Math.round(level*(2/3) + 10*randn_bm()));
		quest.b 	= 1 + Math.ceil(Math.random()*12);
		quest.ans 	= quest.a * quest.b;
		quest.op			= 'x';
		generate_prompt();
	}

	function generate_sub(level){
		quest.b 	= Math.abs(Math.round(level + 10*randn_bm()));
		quest.ans 	= Math.round(2*level*Math.random());
		quest.a 	= quest.ans + quest.b; 
		quest.op 			= '―';
		generate_prompt();
	}

	function generate_div(level){
		quest.ans 	= Math.abs(Math.round(level/3 + 10*randn_bm())); 
		quest.b 	= 2 + Math.ceil(level*Math.random()/3);
		quest.a 	= quest.b * quest.ans;
		quest.op 			= '÷';
		generate_prompt();
	}

	var op_counter = 0;
	//TODO make the op_cycle dependent on URL parameters
	const op_cycle = [generate_add, generate_mul, generate_sub, generate_div];
	
	function generate_prompt(){
		quest.widest = Math.max(	quest.a.toString().length, 
						quest.b.toString().length,
						quest.ans.toString().length);
		quest.bar 			= '―'.repeat(quest.widest + 2);
		quest.top_cushion 	= ' '.repeat(quest.widest - quest.a.toString().length + 2);
		quest.bot_cushion 	= ' '.repeat(quest.widest - quest.b.toString().length + 1);
		quest.ans_cushion	= ' '.repeat(quest.widest - quest.ans.toString().length + 2);
		quest.margin 		= ' '.repeat(Math.floor((NUM_COLS - quest.widest)/2));
	}
	
	function PROMPT() {
		return 	quest.margin 				+ quest.top_cushion + quest.a + "\n\r" + 
				quest.margin + quest.op 	+ quest.bot_cushion + quest.b + "\n\r" +
				quest.margin + quest.bar	+ "\n\r"+ 
				quest.margin 				+ quest.ans_cushion; 	
	}
	
	function score(time_taken) {
		if (time_taken < 1000 + level*10)
			return 5
		if (time_taken < 2000 + level*10)
			return 3
		if (time_taken < 3000 + level*10)
			return 2
		return 1
	}

	function prompt(term) { term.write('\n\r' + PROMPT()); }	

	function check(ans) {
		if (parseInt(ans) == quest.ans){
			time_taken = Date.now() - quest_start;
			level += score(time_taken);	
			op_cycle[(op_counter++)%op_cycle.length](level);
			quest_start = Date.now();
			if (isTimeOut()){
				ready = false;
				between_games = true;
				clearInterval(id);
				term.writeln("\n\n\rlevel: " + level.toString());
				term.writeln("\x1b[95m<enter> again?");
				term.writeln("  or <escape>?\x1b[97m");
			}
		}
	}

	//--------------------------------------------------------------Terminal settings
	/*TODO I think I want to make my own terminal emulator and use
	 * it instead of the term.js thing. It's much bulkier than what
	 * I need, both memory-wise and in the number of features. 
	 * I need to use something lighter, that basically only does put_char()
	 * and get_line(). I will have a much easier time scaling it since
	 * html canvas 
	 */

	const term = new Terminal( // takes object as perameter (see docs)
		{ 
			theme: {
				background: "#336699",
			},
			rows: NUM_ROWS,
			cols: 40,
			cursorBlink: false,
			// this upcoming font size is a total guess, it seems to fit on a 
			// standard screen width but does not handle resizes well. 
			// another thing that making an emulator from scratch would free me from
			fontSize: Math.floor(innerHeight/ (NUM_ROWS*2)),
			fontWeight: 900
		});

	var buffer = []; // TODO: might be accessible directly from term...
	
	function reset() {
		return 0;
	}

	//--------------------------------------------Open terminal and initiate listeners	
	
	term.open(document.getElementById('terminal'));
	//term.write('\x1b[95m') // font color
	term.onKey(e => { // this listener can be linked to anything, even the canvas terminal
		const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey 
			       && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
		
		// ENTER pressed
		if (e.domEvent.keyCode === 13) {
			if (!ready) { // put this in reset() subroutine
				ready = true;
				level = 1;
				op_cycle[(op_counter++)%op_cycle.length](level);
				START_TIME = Date.now();
				quest_start = START_TIME; // First question
				id = setInterval(draw_canvas, 50); 
			}

			if (between_games){
				between_games = false;
			}

			// if the answer is wrong, don't send it?
			check(buffer.join(''));
			buffer = [];
			if (!isTimeOut()) prompt(term);
		
		// BACKSPACE
		} else if (e.domEvent.keyCode === 8 && 
		term._core.buffer.x > (quest.ans_cushion.length + 
							   quest.margin.length)){
				buffer.pop();
				term.write('\b \b');
			
		// LEGIT INPUT
		} else if (	digits.includes(e.key) && 
					(buffer.length < quest.ans.toString().length)){
			buffer.push(e.key);
			term.write(e.key);

		// FULL SCREEN
		} else if ("Ff".includes(e.key)){
			openFullscreen();
			term.scrollToBottom();
		}
	});

	//----------------------------------------------------------------------------------
	//TODO control both width and height. keep it at a 2:3 ratio or something
	onresize = function() { 
		// make it minimum with a width-based measurement
		term.setOption("fontSize", Math.floor(innerHeight*4/(NUM_ROWS*6)));
		term.clear();
		if (ready) prompt(term);
	}

	window.onload = function() {
		term.focus();
		term.write("Calculator Quest");
		term.write("\n\r\x1b[95m<f> : fullscreen \n\r<enter> : begin\x1b[97m");
	};
	
	var elem = document.documentElement;
	/* View in fullscreen */
	function openFullscreen() {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			elem.msRequestFullscreen();
		}
	}


