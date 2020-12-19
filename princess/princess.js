//prompt("got here"); // this is just a debugging thing, put this somewhere as a breakpoint


const desired_rows = 15;

const white = '\x1b[97m';
const yellow = '\x1b[93m';
const blue = '\x1b[94m';
const red = '\x1b[91m';
const green = '\x1b[92m';

function princess(input){
	let head = input.charAt(0);
	let tail = input.charAt(input.length - 1);
	let rest = input.substring(1);

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

function test1(input){return (princess(input) == input);}
function test2(input){return (princess(input) == input + input);}
function test3(input){return (princess(input) == input.split("").reverse().join(""));}
function test4(input){return (princess(input) == input.substring(0,input.length-1));}
function test5(input){return (princess(princess(input)) == input);}
function test6(input){return (princess(princess(input)) ==  input.split("").reverse().join(""));}


const reminder ="\n\rRule I                        "+green+"1"+white+"a"+green+"2"+white+" → a\n\r"+
	"Rule II        if a → b, then "+green+"3"+white+"a → bb\n\r"+
	"Rule III       if a → b, then "+green+"4"+white+"a → b↩\n\r"+
	"Rule IV        if a → b, then "+green+"5"+white+"a → ◌b\n\r"+
	"Rule V         if a → b, then "+green+"6"+white+"a → 1b\n\r"+
	"Rule VI        if a → b, then "+green+"7"+white+"a → 2b\n\n\r"


//TODO make these more engaging
var prompts = 
	[
		yellow + "The first test: Echo\n\r"+
		"Get the princess to echo your number.\n\r"+ blue + 
		"	x → x\n\n\r" + white,

		yellow + "The second test:\n\r"+ blue + 
		"	x → xx\n\n\r" + white,

		yellow + "the third test:\n\r"+ blue + 
		"	x → x↩\n\n\r" + white,

		yellow + "the fourth test:\n\r"+ blue + 
		"	x → x◌ (final digit removed)\n\n\r",

		yellow + "the fifth test:\n\r"+ blue + 
		"	x → y → x\n\n\r",

		yellow + "the sixth test:\n\r"+ blue + 
		"	x → y → x↩'.\n\n\r"
	]

var tests = [test1, test2, test3, test4, test5, test6];
        const term = new Terminal(
                        {
                                theme: {
                                        background: "#882255",
                                },
                                rows: desired_rows,
                                cols: 60,
                                cursorBlink: true,
                                fontSize: Math.floor(innerHeight/(desired_rows*5/4)),
                                fontWeight: 900
                        });

	term.open(document.getElementById('terminal'));
	const princess_prompt = '\r\nSend her a number...  ';

	function runFakeTerminal() {
		var i = 0;

		term.write('\x1b[97m');
		term.writeln(prompts[i]);
		prompt(term);

		var buffer = "";

		term.onKey(e => {
			const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
			
			if ([37,39,38,40].includes(e.domEvent.keyCode)) return; // disable arrow keys for now they're buggy 

			if (e.domEvent.keyCode === 13) {
				if (buffer == "") return;
				if (buffer == "?"){
					term.write(reminder);
					prompt(term);
					buffer = "";
					return
				}
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
				if (term._core.buffer.x > princess_prompt.length - 2) {
					buffer = buffer.substring(0, buffer.length - 1);
					term.write('\b \b');
				}
			} else if (printable) {
				buffer = buffer + e.key;
				term.write(e.key);
			}
		});
	}

	        window.addEventListener("resize", resize_term);
                function resize_term(){
                        let font_height = Math.floor(innerHeight/(desired_rows*5/4));
                        term.setOption("fontSize", font_height);
                }


	function prompt(term) {
		term.write(princess_prompt);
	}

	runFakeTerminal();
