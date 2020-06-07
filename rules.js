/**
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
*/

/**
 * Test user on rules one at a time. 
 * Assert a set of pre-determined output values
 * Make sure uesr know how to use all of the rules
 */

const white = '\x1b[97m';
const yellow = '\x1b[93m';
const blue = '\x1b[94m';
const red = '\x1b[91m';

const INTRODUCTION = 	"There is a princess who lives far away.\n\r" + 
		    	"She has a way with numbers, by the way.\n\r" + 
			"She has this game she plays, a number game:\n\r"+
			"You send her a number, she'll do the same:\n\r"+
			"Her number will be in response to yours.\n\r"+
			"And yes, She'll teach you how it works, of course.\n\r"+
			"She will reward the one that meets her test,\n\r"+
			"Just learn six rules and figure out the rest.\n\r"+
			"The princess is waiting.\n\r"+ 
			"First she will teach you the rules:\n\n\n\r";

const rules = 
	[
		yellow + "Rule 0: notation:\n\r"+ white + 
		"in these rules, variables stand for numbers,\n\r"+
		"not just digits, so x can be 2 or it can be 1234\n\r"+
		"when you see variables next to each other,\n\r"+
		"it means concatenation, not multiplication\n\r"+
		"so if x = 543 and y = 987 xy means 5439878\n\r"+
		"and 3x means 3543\n\r"+
		"x -> y means: when you send the princess x,\n\r"+
		"she will respond with y.\n\n\r"+
		yellow + "Rule I: getting a response\n\r"+ white + 	
		"		(1a2 -> a)\n\r" + 
		"Examples: 	16542 -> 654\n\r"+
		"		11922 -> 192\n\r"+
		"Play with the rule. Does it make sense?\n\r"+
		"What number would you send to get 1643 back\n\r"+
		"		x -> 1643\n\n\n\r",

		yellow + "RULE II: doubling\n\r"+ white +
		"		(if a -> b then 3a -> aa)\n\r"+
		"Examples:      Since 116432 -> 1643\n\r"+
		"		     3116432 -> 16431643\n\r"+
		"		Since 1432 -> 43\n\r"+
		"		     31432 -> 4343\n\r"+
		"               and 331432 -> 43434343\n\r"+
		"Using rule II:\n\r"+
		"What number would you send to get 123123 back?\n\r"+
		"                   x -> 123123\n\n\n\r",

		yellow + "RULE III: reversal\n\r"+ white + 
		"		(if a->b, then 4a -> b^-1)\n\r"+
		"Example:      since 19872 -> 987\n\r"+
		"		    419872 -> 789\n\r"+
		"Use rule III to make her send back 123\n\r",

		yellow + "Rule IV: ereasure\n\r"+ white + 
		"(if a->b, then 5a-> b*with the first digit removed)\n\r"+
		"Example:      since 127432 -> 2743\n\r"+
		"		    5127432 -> 743\n\r"+
		"Use rule IV to make her send back 375\n\r",

		yellow + "Rule V: addition    (if a->b then 6a->1a)\n\r"+ white + 
		"Example:      since 15552 -> 555\n\r"+
		"                   615552 -> 1555\n\r"+
		"Use rule V to return 1919\n\r",

		yellow + "Rule VI: addition(2) (if a->b then 7a->2a\n\r"+ white +
		"Example:      since 13432 -> 343\n\r"+
		" 		    713432 -> 2343\n\r"+
		"Use rule VI ro return 222\n\r",

		red + "End of the rules\n\n\r"
	]

// this is how we make sure they understand the rules
const asserts = 
	[    // (required number, test assert equal)   
		["1","1643"],
		["3","123123"],
		["4", "123"],
		["5", "375"],
		["6", "1919"],
		["7", "222"]
	]

/**
 * pass it the buffer, and where to look in the asserts aray
 */
function test(input, i){
	return ((input.startsWith(asserts[i][0])) && (princess(input) == asserts[i][1]));
}


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
            term.write('\r\nType it here: ');
        };
	//term.write('\x1b[48;2;30;60;90m')
	term.write('\x1b[97m');
        term.write(INTRODUCTION);

	var i = 0;
        term.writeln(rules[i]);
        prompt(term);
	
        var buffer = "";
        
        term.onKey(e => {
            const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

            if (e.domEvent.keyCode === 13) 
	    {
		if (buffer == "") return;
	    if (buffer.toLowerCase().includes("i understand"))
		term.dispose();
	    term.writeln("\n\rthe princess would return: " + princess(buffer));
	    if (test(buffer, i))
	    {
		    i++;
		    term.writeln(red + "\n\n\n    Correct\n\n\n\n\r");
		    term.writeln(rules[i]);
	    }
	        buffer = "";
                prompt(term);
	    if (i > rules.length)
		    term.dispose();
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
            term.write('\r\nType it here: ');
    }
    
    runFakeTerminal();
});
