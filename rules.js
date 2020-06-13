/**
 * Test user on rules one at a time. 
 * Assert a set of pre-determined output values
 * Make sure uesr know how to use all of the rules
 */

const white = '\x1b[97m';
const yellow = '\x1b[93m';
const blue = '\x1b[94m';
const red = '\x1b[91m';
const green = '\x1b[92m';

const INTRODUCTION = yellow + "There is a princess who lives far away,\n\r" + 
	"She has a way with numbers, by the way.\n\r" + 
	"She has this game she plays, a number game:\n\r"+
	"You send her a number, she'll do the same.\n\r"+
	"Her number will be in response to yours,\n\r"+
	"And yes, She'll teach you how it works, of course.\n\r"+
	"She will reward the one that meets her test,\n\r"+
	"Just learn six rules and figure out the rest.\n\r"+
	"The princess is waiting...\n\r"+ 
	"First she will teach you the rules.\n\n\r"+
	"(Already know the rules? press ESC)\n\n\r"+
	green + "Tell the princess you are ready:"

const rules = 
	[
		yellow + "Rule 0: notation\n\r"+ white + 
		"▸ A single letter can be used to represent\n\r"+
		"	either a single-digit, or a multi-digit number.\n\r"+
		"	So x can be 2 or it can be 1234\n\r"+
		"▸ No letter has any special meaning,\n\r"+
		"	they are all just variables (a,b,x)\n\r"+
		"▸ When you see variables next to each other,\n\r"+
		"	it means concatenation, not multiplication\n\r"+
		"	so if a = 543 and b = 987 ab means 543987\n\r"+
		"	and 3a means 3543\n\r"+
		"▸ a → b means: when you send the princess a,\n\r"+
		"	       she will respond with b.\n\n\r"+
		yellow + "Rule I: getting a response\n\r"+ white + 	
		"		(1a2 → a)\n\r" + 
		"Examples: 	16542 → 654\n\r"+
		"		11922 → 192\n\r"+
		"Play with the rule. Does it make sense?\n\r"+
		"What number would you send to get 1643 back\n\r"+
		"in the notation: Find an x such that: x → 1643\n\n\r",

		yellow + "RULE II: doubling\n\r"+ white +
		"		(if a → b then 3a → bb)\n\r"+
		"Examples:      Since 116432 → 1643\n\r"+
		"		     3116432 → 16431643\n\r"+
		"		Since 1432 → 43\n\r"+
		"		     31432 → 4343\n\r"+
		"               and 331432 → 43434343\n\r"+
		"Using rule II:\n\r"+
		"What number would you send to get 123123 back?\n\r"+
		"                   x → 123123\n\n\n\r",

		yellow + "RULE III: reversal\n\r"+ white + 
		"		(if a→b, then 4a → b↩ (b with its digits reversed))\n\r"+
		"Example:      since 19872 → 987\n\r"+
		"		    419872 → 789\n\r"+
		"Use rule III to make her send back 123\n\r",

		yellow + "Rule IV: ereasure\n\r"+ white + 
		"(if a→b, then 5a→ ◌b (b with the first digit removed))\n\r"+
		"Example:      since 127432 → 2743\n\r"+
		"		    5127432 → 743\n\r"+
		"Use rule IV to make her send back 375\n\r",

		yellow + "Rule V: addition(1) (if a→b then 6a→1b)\n\r"+ white + 
		"Example:      since 15552 → 555\n\r"+
		"                   615552 → 1555\n\r"+
		"Use rule V to return 1919\n\r",

		yellow + "Rule VI: addition(2) (if a→b then 7a→2b)\n\r"+ white +
		"Example:      since 13432 → 343\n\r"+
		" 		    713432 → 2343\n\r"+
		"Use rule VI ro return 222\n\r",

		yellow + "Rule ∞: rules can be used in any combination\n\r"+ white +
		"Example:      since   14342 →  434\n\r"+
		"               and   614342 → 1434       (addition(1))\n\r"+
		"              then  3614342 → 14341434   (doubling)\n\r"+
		"Use rules IV(ereasure) and II(doubling) to get the \n\r"+
		"princess to send you the number 47747\n\r",

		red + "And those are all the rules.\n\n\r" + white + 
		"Do not forget them:\n\n\n\r"+
		"Rule I                        "+green+"1"+white+"a"+green+"2"+white+" → a\n\r"+
		"Rule II        if a → b, then "+green+"3"+white+"a → bb\n\r"+
		"Rule III       if a → b, then "+green+"4"+white+"a → b↩\n\r"+
		"Rule IV        if a → b, then "+green+"5"+white+"a → ◌b\n\r"+
		"Rule V         if a → b, then "+green+"6"+white+"a → 1b\n\r"+
		"Rule VI        if a → b, then "+green+"7"+white+"a → 2b\n\n\r"+
		"Now you are ready for the tests ↴\n\r"+
		"Send the princess a ? if you need a reminder..."
	]

// this is how we make sure they understand the rules
const asserts = 
	[    // (required number, test assert equal)   
		["1","1643"],
		["3","123123"],
		["4", "123"],
		["5", "375"],
		["6", "1919"],
		["7", "222"],
		["53", "47747"]
	]

/**
 * pass it the buffer, and where to look in the asserts aray
 */
function test(input, i){
	return ((input.startsWith(asserts[i][0])) && (princess(input) == asserts[i][1]));
}


$(function () {
	var term = new Terminal({theme: {background: "#006699"}}, {cursorWidth: 100});

	term.setOption("fontSize", 30);
	term.setOption("fontWeight", 900);
	//term.setOption("fontFamily", "Ubuntu Mono");
	term.open(document.getElementById('terminal'));

	const term_prompt = '\r\nTry a number: ';
	
	function runFakeTerminal() {
		if (term._initialized) {
			return;
		}


		term._initialized = true;

		term.write('\x1b[97m'); // sets text color
		term.write(INTRODUCTION);

		var i = 0; 		// index to iterate through the rules
		started = false;

		var buffer = ""; // initialize an empty buffer. I think this can be accessed 
				 // through term._core.buffer instead of building manually

		term.onKey(e => {
			if (e.domEvent.keyCode === 27) term.dispose();
			
			if ([37,39,38,40].includes(e.domEvent.keyCode)) return; // disable arrow keys for now they're buggy 

			const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
			if (started == false) {
				term.reset();
				buffer = "";
				term.writeln(rules[0]);
				prompt(term);
				started = true;
				return;
			}
			if (e.domEvent.keyCode === 13) 
			{
				if (buffer == "") return; // don't let them send an empty string

				if (i == rules.length-1) term.dispose(); //done learning rules.

				term.writeln("\n\rthe princess would return: " + princess(buffer));
				if (test(buffer, i)){
					i++;
					term.writeln(red + "\n\n\n    Correct\n\n\n\n\r");
					term.writeln(rules[i]);
					if (i == rules.length - 1) return; // so we don't prompt after the rules print out
								           // is it stupid to check this twice? probably.		
				}

				buffer = "";
				prompt(term);

			} else if (e.domEvent.keyCode === 8) { // backspace
				// Do not delete the prompt
				if (term._core.buffer.x > term_prompt.length - 2) {
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
		term.write(term_prompt);
	}

	runFakeTerminal();
});
