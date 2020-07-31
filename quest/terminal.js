
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
	var level = 5;
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
		return 1;
	}

	function prompt(term) { term.write('\n\r' + PROMPT()); }	

	function check(ans) {
		if (parseInt(ans) == question.ans){
			time_taken = Date.now() - question_start;
			level += score(time_taken);	
			generate_add(level)
			if (isTimeOut())
				term.write("out of time");;
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
	term.write('\x1b[97m') // font color
	prompt(term);

	term.onKey(e => {
		const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey 
			       && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

		if (e.domEvent.keyCode === 13) { // ENTER pressed
			check(buffer.join(''));
			buffer = []; // reset buffer
			prompt(term);
		} else if (e.domEvent.keyCode === 8) { // Backspace pressed
			if (term._core.buffer.x > question.ans_cushion.length){
				buffer.pop();
				term.write('\b \b');
			}
		} else if (digits.includes(e.key)) { // standard character
			buffer.push(e.key);
			term.write(e.key);
		} else if ("Ff".includes(e.key)){
			openFullscreen();
			prompt(term);
		}

	});

	//TODO control both width and height. keep it at a 2:3 ratio or something
	onresize = function() { term.setOption("fontSize",
				Math.floor(innerHeight*4/(NUM_ROWS*6)));}

	//----------------------------------------------------------------------------------


	window.onload = function() {
		openFullscreen();
		term.focus();
		prompt(term);
	};
