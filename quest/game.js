	var ready = false;
	var between_games = false;


	//-------------------------------------------Initialization of progress bar	
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	const urlParams = new URLSearchParams(window.location.search);
	var START_TIME = -1;       	

	function computeDecimalFull(time) {
		if (START_TIME < 0)
			return 0;
		let elapsed = time - START_TIME;
		let part = elapsed / TIME_LIMIT;
		return Math.min(1, part);
	}
	
	let color1 = '#4499EE';
	let color2 = '#255585';
	
	function progress_bar(){
		const decimalFull = computeDecimalFull(Date.now());
		const widthFull = decimalFull*canvas.width;
		context.fillStyle = color1; // ?? fix name
		context.fillRect(0,0, widthFull, canvas.height);
		context.fillStyle = color2;
		context.fillRect(widthFull, 0, canvas.width-widthFull, canvas.height);
	}

	var TIME_LIMIT = 1000 * 30;

	function isTimeOut() {
   		return START_TIME + TIME_LIMIT < Date.now();
	}

	//-------------------------------------------------------Resize Event Listener
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

	//at start of playing
	
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

	/* Close fullscreen */
	function closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) { /* Firefox */
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE/Edge */
			document.msExitFullscreen();
		}
	}

	const NUM_COLS = 16;
	const NUM_ROWS = 4;
	const digits = "0123456789";
	var level = 0;
	var question_start;
	
	var question = {};
	function generate_add(level){
		question.a = Math.round(2*level*Math.random());
		question.b = Math.round(2*level*Math.random());
		question.ans = question.a + question.b;
		question.widest = Math.max(	question.a.toString().length, 
						question.b.toString().length,
						question.ans.toString().length);
		question.op = '+';
		question.bar = '―'.repeat(question.widest + 1);
		question.top_cushion = ' '.repeat(question.widest - question.a.toString().length + 1);
		question.bot_cushion = ' '.repeat(question.widest - question.b.toString().length);
		question.ans_cushion = ' '.repeat(question.widest - question.ans.toString().length + 1);
		question.margin = ' '.repeat(Math.floor((NUM_COLS - question.widest)/2));
	}

	generate_add(level); // first question
	question_start = Date.now();
	
	function PROMPT() {
		return 	question.margin + 		question.top_cushion + question.a.toString() +"\n\r"+ 
			question.margin + question.op + 	question.bot_cushion + question.b.toString() + "\n\r"+
			question.margin + question.bar +  "\n\r"+ 
			question.margin + 		question.ans_cushion; 	
			
	}
	
	function score(time_taken) {
		if (time_taken < 1000)
			return 3;
		if (time_taken < 2000)
			return 2;
		if (time_taken < 3000)
			return 1;
		return 0;
	}

	function prompt(term) { term.write('\n\r' + PROMPT()); }	

	function check(ans) {
		if (parseInt(ans) == question.ans){
			time_taken = Date.now() - question_start;
			level += score(time_taken);	
			generate_add(level)
			question_start = Date.now();
			if (isTimeOut()){
				ready = !1;
				between_games = true;
				clearInterval(id);
				//display press enter to play again
				term.clear();
				term.writeln("\n\n\rlevel: " + level.toString());
				term.writeln("\x1b[95m<enter> again?");
				term.writeln("  or <escape>?\x1b[97m");
			}

		}
	}

	//--------------------------------------------------------------Terminal settings

	const term = new Terminal( // takes object as perameter (see docs)
		{ 
			theme: {
				background: "#336699",
			},
			rows: NUM_ROWS,
			cols: 40,
			cursorBlink: false,
			fontSize: Math.floor(innerHeight/ (NUM_ROWS*2)),
			fontWeight: 900
		});

	var buffer = []; // TODO: might be accessible directly from term...
	
	//--------------------------------------------Open terminal and initiate listeners	
	
	term.open(document.getElementById('terminal'));
	//term.write('\x1b[95m') // font color
	term.onKey(e => {
		const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey 
			       && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
		
		// ENTER pressed
		if (e.domEvent.keyCode === 13) {
			if (!ready) {
				ready = true;
				START_TIME = Date.now();
				id = setInterval(draw_canvas, 50); 
				level = 0;
			}
			if (between_games){
				between_games = false;
			}
			check(buffer.join(''));
			buffer = []; // reset buffer
			if (!isTimeOut())
				prompt(term);
		
		// BACKSPACE
		} else if (e.domEvent.keyCode === 8 && 
		term._core.buffer.x > (question.ans_cushion.length + 
							   question.margin.length)){
				buffer.pop();
				term.write('\b \b');
			
		// LEGIT INPUT
		} else if (	digits.includes(e.key) && 
					(buffer.length < question.ans.toString().length)){
			buffer.push(e.key);
			term.write(e.key);

		// FULL SCREEN
		} else if ("Ff".includes(e.key)){
			openFullscreen();
			term.scrollToBottom();
		}

	});

	//TODO control both width and height. keep it at a 2:3 ratio or something
	onresize = function() { 
		// make it minimum with a width-based measurement
		term.setOption("fontSize", Math.floor(innerHeight*4/(NUM_ROWS*6)));
		term.clear();
		if (ready) prompt(term);
	}

	//----------------------------------------------------------------------------------


	window.onload = function() {
		term.focus();
		term.write("Calculator Quest");
		term.write("\n\r\x1b[95m<f> for fullscreen \n\r<enter> to begin\x1b[97m");
	};
