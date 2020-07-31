
	var level = 5;
	var question = {};
	var question_start;
	function generate_add(level){
		question.a = level;
		question.b = level;
		question.ans = question.a + question.b;
		question.op = '+';
	}

	generate_add(level); // first question
	question_start = Date.now();
	function PROMPT() {
		return question.a.toString() + question.op + question.b.toString() + '=';
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
	const NUM_COLS = 40;
	const NUM_ROWS = 10;

	const term = new Terminal( // takes object as perameter (see docs)
		{ 
			theme: {
				background: "#336699",
			},
			rows: NUM_ROWS,
			cols: 40,
			cursorBlink: true,
			fontSize: Math.floor(innerHeight*4/ (NUM_ROWS*6)),
			fontWeight: 900
		});

	var buffer = []; // TODO: might be accessible directly from term...
	
	//--------------------------------------------Open terminal and initiate listeners	

	term.open(document.getElementById('terminal'));
	term.write('\x1b[97m') // this is how you set font color
	//term.writeln('Coming Soon: Calculator Quest'); 
	prompt(term);

	term.onKey(e => {
		const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey 
			       && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

		if (e.domEvent.keyCode === 13) { // ENTER pressed
			check(buffer.join(''));
			buffer = []; // reset buffer
			prompt(term);
		} else if (e.domEvent.keyCode === 8) { // Backspace pressed
			if (term._core.buffer.x > PROMPT().length) {
				buffer.pop()
				term.write('\b \b');
			}
		} else if (printable) { // standard character
			buffer.push(e.key);
			term.write(e.key);
		}
	});

	//TODO control both width and height. keep it at a 2:3 ratio or something
	onresize = function() { term.setOption("fontSize",
				Math.floor(innerHeight*4/(NUM_ROWS*6)));}

	//----------------------------------------------------------------------------------

