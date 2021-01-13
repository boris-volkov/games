let cards = [];
let start_time;

function check(my_answer){
	my_answer = my_answer.join("");

	if (my_answer === ':q'){ // allow users a way out
		finish();
		return;
	}

	if (my_answer === cards[cards.length-1].answer){
		cards.pop();
		if (cards.length === 0) {
			finish();
			return;
		}
	}

	ask(cards[cards.length-1].question, check);
}

function init_multiplication(args) {
	n = 12; // default
	if (args[0])
		n = Number(args[0]);
	for (let i = 1; i < n+1; i++)
		for (let j = i; j < n+1; j++)
			cards.push({question : i + ' x ' + j + ' = ',
						answer   : (i*j).toString()});
	scramble();
	print("\nLets practice multiplication!\n");
	print("Enter :q any time to quit\n\n");
	start_time = new Date().getTime()/1000;
	ask(cards[cards.length-1].question, check);
}

function finish(){
	if (cards.length === 0){
		let elapsed = new Date().getTime()/1000 - start_time;
		print("\nyou took " + Math.round(elapsed) + " seconds!\n");
		print("great job!\n-------------\n");
	} else { // early exit
		print("quit\n\n");
	}
	cards = [];
	LISTENER = NO_OP; // important: stop listening
}

function scramble(){
	// swap two random cards 300 times
	for (let i = 0; i < 300; i++){
		let a = Math.floor(Math.random()*cards.length);
		let b = Math.floor(Math.random()*cards.length);
		let temp = cards[a];
		cards[a] = cards[b];
		cards[b] = temp;
	}
	return 0;
}
	
COMMANDS['.times'] = init_multiplication;
