
//prompt("got here");

function princess(input){
	var head = input.charAt(0);
	var tail = input.charAt(input.length - 1);
	var rest = input.substring(1);
	
	if (head == "1" && tail == "2")
		return input.substring(1,input.length - 1);
	else if (head == "3")
		return princess(rest) + princess(rest);
	else if (head == "4")
		return princess(rest).split("").reverse().join("");
	else if (head == "5")
		return princess(rest).substring(1);
	else if (head == "6")
		return "1" + princess(rest);
	else if (head == "7")
		return "2" + princess(rest);
	else
		return "";
}

function test1(input){
	return (princess(input) == input);
}
function test2(input){
	return (princess(input) == input + input);
}

function test3(input){
	return (princess(input) == input.split("").reverse().join(""));
}

function test4(input){
	return (princess(input) == input.substring(0,input.length-1));
}

function test5(input){
	return (princess(princess(input)) == input);
}

function test6(input){
	return (princess(princess(input)) ==  input.split("").reverse().join(""));
}


//TODO make these more engaging
var prompts = 
[
	yellow + "The first test:\n\r"+
	"Send the princess a number that would make her\n\r"+
	"respond with the exact same number\n\r" + blue + 
	"x->x\n\n\r" + white,

	yellow + "The second test:\n\r"+ blue + 
	"x->xx\n\n\r" + white,

	yellow + "the third test:\n\r"+ blue + 
	"x->x(digits reversed)\n\n\r" + white,

	yellow + "the fourth test:\n\r"+ blue + 
	"x->x(after a popleft() and a popright())\n\n\r",

	yellow + "the fifth test:\n\r"+ blue + 
	"x->y->x find a cyclic element of order 2\n\n\r", // is that right Tim?

	yellow + "the sixth test:\n\r"+ blue + 
	"x->y->x with its digits reversed.\n\n\r"
]

var tests = [test1, test2, test3, test4, test5, test6];

$(function () {
    var term = new Terminal({theme: {background: "#882255"}}, {cursorWidth: 100});

    term.setOption("fontSize", 40);
    term.setOption("fontWeight", 900);
    //term.setOption("fontFamily", "Ubuntu Mono");
    term.open(document.getElementById('terminal'));

    function runFakeTerminal() {
	var i = 0;
        
	if (term._initialized) {
            return;
        }

        term._initialized = true;

        term.prompt = () => {
            term.write('\r\nSend her a number...  ');
        };
	//term.write('\x1b[48;2;30;60;90m')
	term.write('\x1b[97m');
        term.writeln(prompts[i]);
        prompt(term);
	
        var buffer = "";
        
        term.onKey(e => {
            const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

            if (e.domEvent.keyCode === 13) {
		if (buffer == "") return;
		term.write("\r\n\x1b[94m" +  "The princess returns: " + princess(buffer) + "\x1b[97m");
		if (tests[i](buffer)){
			i++;
			term.write("\x1b[91m\r\nYou passed Test " + i + "!\x1b[97m\r\n\n");
			term.write(prompts[i]);
		}
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
      	term.write('\r\nSend her a number...  ');
    }
    
    runFakeTerminal();
});
