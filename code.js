/**
 * This is just an API for the user to be able to do input/output in the browser-terminal
 * It listens for key-presses and writes them to screen.
 * When ENTER is pressed, everything on the working line is sent in a buffer to... 
 * anywhere you want. This, or something similar will be necessary code in every terminal app.
 */


$(function () {
    var term = new Terminal({theme: {background: "#006699"}}, {cursorWidth: 100});

    term.setOption("fontSize", 40);    // TODO figure out how to choose font size based on user's screen
    term.setOption("fontWeight", 900); // these kinds of adjustments are all in docs xtermjs.org
    //term.setOption("fontFamily", "Ubuntu Mono");  //one way you can set font if you need to 
    term.open(document.getElementById('terminal')); // this name is defined in the HTML caller

    function runFakeTerminal() {
        if (term._initialized) {
            return;
        }

        term._initialized = true;

        term.prompt = () => {
            term.write('\r\n$ ');
        };
	//term.write('\x1b[48;2;30;60;90m')
	term.write('\x1b[97m') // this is how you change font color
        term.writeln('This is a template terminal interface. Just Add Logic!');
        prompt(term);
	
        var buffer = "";
        
	    
	/**
	 * right now the handler is saving everything that gets typed into a buffer,
	 * but it dosn't have to do that. For more interactive games the key-presses
	 * can be routed to another handler. 
	 * TODO fix being able to press left to go back into text and overwrite.. disable (<-?)
	 *      or else make it behave correctly to insert. Would need to change buffer logic too.
	 */
        term.onKey(e => {
            const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

            if (e.domEvent.keyCode === 13) { // ENTER pressed: new line and clear buffer
		if (buffer == "done")
		    term.dispose();
		term.write("\n\r buffer contains:" + buffer);
	        buffer = "";
                prompt(term);
            } else if (e.domEvent.keyCode === 8) { // Backspace pressed
                // Do not delete the prompt
                if (term._core.buffer.x > 2) { // This number needs to be adjusted based on prompt length
		    buffer = buffer.substring(0, buffer.length - 1);
                    term.write('\b \b');
                }
            } else if (printable) { // standard character
		buffer = buffer + e.key;
                term.write(e.key);
            }
        });
    }

    function prompt(term) { // I think it's wierd that this coexists with the other prompt function above
      term.write('\r\n$ '); // is it really necessary to have both
    }
    
    runFakeTerminal();
});
