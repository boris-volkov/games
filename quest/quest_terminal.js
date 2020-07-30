/**
 * This is just an API for the user to be able to do input/output in the browser-terminal
 * It listens for key-presses and writes them to screen.
 * When ENTER is pressed, everything on the working line is sent in a buffer to... 
 * anywhere you want. This, or something similar will be necessary code in every terminal app.
 */

	//--------------------------------------------------------------Terminal settings
	const NUM_COLS = 40;
	const NUM_ROWS = 10;
	const PROMPT = '$ ';
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
	function prompt(term) { term.write('\n\r' + PROMPT); }

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
			// do something with buffer
			buffer = []; // reset buffer
			prompt(term);
		} else if (e.domEvent.keyCode === 8) { // Backspace pressed
			if (term._core.buffer.x > PROMPT.length) {
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
