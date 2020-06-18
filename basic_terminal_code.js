/**
 * This is just an API for the user to be able to do input/output in the browser-terminal
 * It listens for key-presses and writes them to screen.
 * When ENTER is pressed, everything on the working line is sent in a buffer to... 
 * anywhere you want. This, or something similar will be necessary code in every terminal app.
 */

$(function () {
	let width = window.innerWidth;
	let height = window.innerHeight;
	var term = new Terminal({theme: {background: "#006699"}}, {cursorWidth: 100});
	term.setOption("fontSize", height/20);  // font now getting set based on window size... great!
	term.setOption("fontWeight", 900); // these kinds of adjustments are all in docs xtermjs.org
	const terminal_prompt = '\r\n$ ';

	//term.setOption("fontFamily", "Ubuntu Mono");  //one way you can set font if you need to 
	term.open(document.getElementById('terminal')); // this name is defined in the HTML caller

	function runFakeTerminal() {
		if (term._initialized) {
			return;
		}
		term._initialized = true;

		term.write('\x1b[97m') // this is how you change font color
		term.writeln('This is a template terminal interface. Just Add Logic!');
		prompt(term);
		
		var buffer = ""; // this is where you collect user input to route to program logic

		/**
		 * right now the handler is saving everything that gets typed into a buffer,
		 * but it dosn't have to do that. For more interactive games the key-presses
		 * can be routed to another handler. 
		 */
		term.onKey(e => {
			const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

			if (e.domEvent.keyCode === 13) { // ENTER pressed: new line and clear buffer
				// do something with buffer
				buffer = ""; // reset buffer
				prompt(term);
			} else if (e.domEvent.keyCode === 8) { // Backspace pressed
				// Do not delete the prompt
				if (term._core.buffer.x > terminal_prompt.length - 2) {
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
			let fontheight = width/40; 
			//window.scrollTo(term._core.buffer.x, term._core.buffer.y*fontheight); // sort of works, could be better
			term.setOption("fontSize", width/40);
			// division by 40 is arbitrary.. just trying it out
		}

	}

	function prompt(term) {
		term.write(terminal_prompt);
	}

	runFakeTerminal();
});


