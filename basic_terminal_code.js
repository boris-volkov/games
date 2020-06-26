/**
 * This is just an API for the user to be able to do input/output in the browser-terminal
 * It listens for key-presses and writes them to screen.
 * When ENTER is pressed, everything on the working line is sent in a buffer to... 
 * anywhere you want. This, or something similar will be necessary code in every terminal app.
 */

	let width = window.innerWidth;
	let height = window.innerHeight;
	const desired_rows = 16;
	var font_size = Math.floor(height/(desired_rows*5/4));
	const term = new Terminal( 
			{ 
				theme: {
					background: "#006699",
				},
				rows: desired_rows,
				cols: 40,
				cursorBlink: true,
				fontSize: font_size,
				fontWeight: 900
			});

	const terminal_prompt = '$ ';
	term.open(document.getElementById('terminal'));

	function runFakeTerminal() {
		if (term._initialized) {
			return;
		}
		term._initialized = true;

		term.write('\x1b[97m') // this is how you change font color
		term.writeln('This is a template terminal interface. \n\rJust Add Logic!');
		prompt(term);
		
		var buffer = ""; // this is where you collect user input to route to program logic

		term.onKey(e => {
			const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

			if (e.domEvent.keyCode === 13) { // ENTER pressed: new line and clear buffer
				// do something with buffer
				buffer = ""; // reset buffer
				prompt(term);
			} else if (e.domEvent.keyCode === 8) { // Backspace pressed
				if (term._core.buffer.x > terminal_prompt.length) {
					buffer = buffer.substring(0, buffer.length - 1);
					term.write('\b \b');
				}
			} else if (printable) { // standard character
				buffer = buffer + e.key;
				term.write(e.key);
			}
		});
		
		window.addEventListener("resize", resize_term);
		function resize_term(){
			let width = window.innerWidth;
			let height = window.innerHeight;
			let font_height = Math.floor(height/(desired_rows*5/4)); 
			term.setOption("fontSize", font_height);
		}

	}

	function prompt(term) {
		term.write('\n\r' + terminal_prompt);
	}

	runFakeTerminal();


