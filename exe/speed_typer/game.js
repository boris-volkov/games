




const timer  = document.querySelector("#timer");
const letter = document.querySelector("#letter");
const counter = document.querySelector("#count");
const chars = Array.from("!1@2#3$4%5^6&7*8(9)0_-+=QqWwEeRrTtYyUuIiOoPp{[}]|AaSsDdFfGgHhJjKkLl:;\"?>.<,MmNnBbVvCcXxZz");

const special = "[]{}()|<>*&^%$#@!_-+=,.;:\"";
let current_letter; 
let count = 0;
let started = 0;


Array.prototype.sample = function(){
	return this[Math.floor(Math.random()*this.length)];
}

function addWordToDOM(){
	current_letter = chars.sample();
	if (special.includes(current_letter))
		letter.innerHTML = "<spec>" + current_letter + "</spec>";
	else if (current_letter >= '0' && current_letter <= '9')
		letter.innerHTML = "<num>" + current_letter + "</num>";
	else if (current_letter >= 'A' && current_letter <= 'Z')
		letter.innerHTML = "<upper>" + current_letter + "</upper>";
	else
		letter.innerHTML = current_letter;
}

let START_TIME;

let elapsed, cps;
function updateAverage() {
	now = new Date().getTime()/1000;
	elapsed = now - START_TIME;
	console.log(elapsed);
	cpm = Math.round(count/elapsed * 60);
	console.log(cpm);
	if (count > 2){
		timer.innerHTML = cpm.toString();
		timer.innerHTML = timer.innerHTML + " characters per minute";
	}
}

document.addEventListener("keydown", e => {
	if (started == 0){
		START_TIME = new Date().getTime()/1000;
		started = 1;
	}
	const insertedText = e.key;

	if (insertedText === current_letter) {
		addWordToDOM();
		count++;
		counter.innerHTML = count;
		updateAverage();
	}
});

addWordToDOM();
