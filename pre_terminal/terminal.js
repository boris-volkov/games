/* 
 * This script sets up a terminal input/output user interface
 * in the browser window, through a pre-formatted element <pre>.
 *
 * It offers the application-programmer-interface of these functions:
 *
 * 1) print(string)
 * 2) ask(string, callback)
 *
 * The first function just prints to screen, the second prints
 * to screen but also identifies a receiving function for the user
 * input to be sent to. This is not quite like input() in Python
 * which returns the input as a string. This ask function sends the
 * input directly to a function whenever the ENTER key is pressed.
 * That function should also be responsible for continuing execution.
 */

const terminal = document.querySelector("#terminal");
	// The terminal is just a <pre> element

const cursor = "█";
	// The cursor is just a block character for now...

const keys_down = new Set();
	// to keep track of combinations of keys being held
	// like CTRL-V for pasting

const COMMANDS = {'.clear': clear,
				  '.ls': listing};
	// storage for command line commands

function listing() {
	print('\n');
	for (command in COMMANDS)
		print(command + '\n');
	print('\n');
}

let buffer = [];
	// this is where the current input line is collected 
	// to be sent out to callback functions.

const buffer_history = [];
let history_index = 0;
	// to be able to cycle through commands with arrows

let input_lock = false;
	// optional input_lock 

function NO_OP(input) {return 0;};
let LISTENER = NO_OP;
	// placeholder for the function currently listening for input

function clear() {
	terminal.innerHTML = cursor;
}

function clear_line() {
	let content = terminal.innerHTML;
	terminal.innerHTML = content.slice(0, content.lastIndexOf("\n")+2);
}

function print(c) {
	// write a character to screen and progress the cursor
	terminal.innerHTML = terminal.innerHTML.slice(0,-1) + c + cursor;
	window.scrollTo(0,document.body.scrollHeight);
}

//TODO backspace doesn't work with this yet. 
function print_color(c, r, g, b) {
	let entry = "<span style='color:rgb(" + r + "," + g + "," + b + ")'>" + c + "</span>";
	// write a character to screen and progress the cursor
	terminal.innerHTML = terminal.innerHTML.slice(0,-1) + entry + cursor;
	window.scrollTo(0,document.body.scrollHeight);
}

// print text and set up function to receive input
function ask(text, func) {
	print(text);
	LISTENER = func;
}

function backspace() {
	let content = terminal.innerHTML;
	if (terminal.innerHTML.endsWith('\n' + cursor)){
		return;
	}
	if (terminal.innerHTML.endsWith(";" + cursor)){ 
		// for special characters like &gt; &lt; &amp;
		terminal.innerHTML = content.slice(0,content.lastIndexOf("&")) + cursor;
	} else {
		terminal.innerHTML = content.slice(0,-2) + cursor;
		buffer.pop();
	}
}

document.addEventListener("keydown", e => {
	let k = e.key;

	keys_down.add(k);
	
	if (["Shift", "Alt", "Tab", "'", "/", "ArrowUp", "ArrowDown"].includes(k)){
		e.preventDefault();
	}

	if (input_lock === true) return;

	// special keys----------------------------
	if (k === "Enter") {
		print('\n');
		if (LISTENER === NO_OP){ // standard cli mode
			if (buffer[0] === '.'){ // command entered
				args = buffer.join('').split(' ');
				if (COMMANDS.hasOwnProperty(args[0])){
					COMMANDS[args[0]](args.slice(1));
				}
			}
			if (buffer.join("").trim().length > 0){
				buffer_history.push(buffer);
			}
		} else {
			LISTENER(buffer);
		}
		buffer = [];	
		history_index = buffer_history.length;
	} else if (k === "Backspace"){ 	
		backspace();
	} else if (k === "Tab"){
		print("&ensp;&ensp;&ensp;&ensp;");
	} else if (k === "ArrowUp"){
		if (LISTENER === NO_OP){
			if (history_index > 0){
				history_index -= 1;
				buffer = buffer_history[history_index];
				clear_line();
				print(buffer.join(''));
			}
		}
	} else if (k === "ArrowDown"){
		if (LISTENER === NO_OP){
			if (history_index < buffer_history.length - 1){
				history_index += 1;
				buffer = buffer_history[history_index];
			} else {
				buffer = [];
				history_index = buffer_history.length;
			}
			clear_line();
			print(buffer.join(''));
		}
	
	// normal text entry:----------------------
	} else if (k.length === 1) {
		if (keys_down.has("Control") && ('+-=v'.includes(k)))
			return;
		print(k);
		buffer.push(k);
	}
});

document.addEventListener("keyup", e => {
	keys_down.delete(e.key);
});

terminal.addEventListener('paste', (event) => { // CTRL-V pasting
    let paste = (event.clipboardData || 
							window.clipboardData).getData('text');
	print(paste);
	buffer.push(paste);
    event.preventDefault();
});

