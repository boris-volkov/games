var bar = '\u2588';

$(function () {
    var term = new Terminal({theme: {background: "#006699"}}, {cursorWidth: 100});

    term.setOption("fontSize", 40);
    term.setOption("fontWeight", 900);
    //term.setOption("fontFamily", "Ubuntu Mono");
    term.open(document.getElementById('terminal'));

    function runFakeTerminal() {
        if (term._initialized) {
            return;
        }

        term._initialized = true;

        term.prompt = () => {
            term.write('\r\n$ ');
        };
	//term.write('\x1b[48;2;30;60;90m')
	term.write('\x1b[97m')
        term.writeln('what kind of world is this? ①');
        prompt(term);
	
        var buffer = "";
        
        term.onKey(e => {
            const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

            if (e.domEvent.keyCode === 13) {
		term.write("\n buffer has:" + buffer);
	        buffer = "";
                prompt(term);
            } else if (e.domEvent.keyCode === 8) {
                // Do not delete the prompt
                if (term._core.buffer.x > 2) {
		    buffer = buffer.substring(0, buffer.length - 1);
                    term.write('\b \b');
                }
            } else if (printable) {
		buffer = buffer + e.key;
                term.write(e.key);
            }
        });
    }

    function prompt(term) {
      term.write('\r\n$ ');
    }
    
    runFakeTerminal();
});
