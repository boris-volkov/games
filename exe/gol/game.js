
const canvas = document.querySelector("#canvas");
const gen_display = document.querySelector("#gen_display");
const play_button = document.querySelector("#play");
const stop_button = document.querySelector("#stop");
const step_button = document.querySelector("#step");
const clear_button = document.querySelector("#clear");
const reset_button = document.querySelector("#reset");

const urlParams = new URLSearchParams(window.location.search);
var num_rows = parseInt( urlParams.get('rows'));
if (isNaN(num_rows)) { num_rows = 48; }
var num_cols = parseInt( urlParams.get('cols'));
if (isNaN(num_cols)) { num_cols = 48; }

let paused = false;
let cell_width = 16;
let grid = new Array(num_rows);
let temp = new Array(num_rows);
let undo_grid = new Array(num_rows);
let interval = 100;
let generations = 0;
let undo_gen = 0;

for (let i = 0; i < num_rows; i++){
	grid[i] = new Array(num_cols).fill(0);
	temp[i] = new Array(num_cols).fill(0);	
	undo_grid[i] = new Array(num_cols).fill(0);	
}

canvas.height = grid.length * cell_width;
canvas.width = grid[0].length * cell_width;
const c = canvas.getContext("2d");

function next_generation(){
	generations++;
	for (let row = 0; row < grid.length; row++){ // make new generation
		for (let col = 0; col < grid[0].length; col++){
			count = count_neighbors(row, col);
			if (grid[row][col] === 1){ // alive
				if (count < 2)
					temp[row][col] = 0;
				else if (count <= 3)
					temp[row][col] = 1;
				else 
					temp[row][col] = 0;

			} else { // if dead
				if (count === 3)
					temp[row][col] = 1;
			}	
		}
	}
	for (let row = 0; row < grid.length; row++){ // write temp grid over main grid
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col] = temp[row][col]        
		}
	}
	clear_transparent();
	grid_to_canvas();
	print_generations();
}

step_button.onclick = next_generation;

Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

function count_neighbors(row, col) {
	let up = (row-1).mod(num_rows);
	let down = (row+1).mod(num_rows);
	let left = (col-1).mod(num_cols);
	let right = (col+1).mod(num_cols);
	let count = 0;
	if (grid[up][right] === 1)
		count++;
	if (grid[up][col] === 1)
		count++;
	if (grid[up][left] === 1)
		count++;
	if (grid[row][right] === 1)
		count++;
	if (grid[row][left] === 1)
		count++;
	if (grid[down][col] === 1)
		count++;
	if (grid[down][right] === 1)
		count++;
	if (grid[down][left] === 1)
		count++;

	return count;
}

function print_generations(){
	gen_display.innerHTML = ('00000'+generations.toString()).slice(-5);
}

function print_count(){
	live_counter.innerHTML = living;
}

let cushion = Math.round(cell_width/6)
cushion -= cushion%2; // make sure it's even

function clear() {
	c.fillStyle = "rgba(35,40,50,1)";
	for (let row = 0; row < grid.length; row++)
		for (let col = 0; col < grid[0].length; col++)
			c.fillRect(cell_width*col + cushion, cell_width*row + cushion, cell_width-2*cushion, cell_width-2*cushion);
}

function clear_transparent() {
	c.fillStyle = "rgba(35,40,50,0.9)";
	for (let row = 0; row < grid.length; row++)
		for (let col = 0; col < grid[0].length; col++)
			c.fillRect(cell_width*col + cushion, cell_width*row + cushion, cell_width-2*cushion, cell_width-2*cushion);
}     

function grid_to_canvas() {
	c.fillStyle = "white";
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			if (grid[row][col] === 1){
				c.fillStyle = "#fff";
				c.beginPath();
				c.arc(Math.round(col*cell_width + cell_width/2), 
					    Math.round(row*cell_width + cell_width/2),
					    Math.round(cell_width/4), 0, 2*Math.PI, false);
				c.fill();
			}
		}
	}
}

function init(){
	c.fillStyle = "#123";
	c.fillRect(0,0, canvas.width, canvas.height);
	clear();
	grid_to_canvas();
}

function clear_grid(){
	generations = 0;
	print_generations();
	stop();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col]= 0;
			temp[row][col]= 0;
		}
	}
	clear();
	grid_to_canvas();
}

clear_button.onclick = clear_grid;

function save_grid(){
	undo_gen = generations;
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			undo_grid[row][col]= grid[row][col];
		}
	}
}

function reset_grid(){
	generations = undo_gen;
	print_generations();
	stop();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col] = undo_grid[row][col];
			temp[row][col] = undo_grid[row][col];
		}
	}
	clear();
	grid_to_canvas();
}

reset_button.onclick = reset_grid;

let id;
function stop(){
	if (!paused)
		clearInterval(id);
	paused = true;
}

stop_button.onclick = stop;

function play(){
	save_grid();
	if (paused)
		id = setInterval(next_generation, interval);
	paused = false;
}

play_button.onclick = play;

function faster(){
	if (interval <= 5)
		return;
	interval -= 5;
	if (paused)
		return;
	stop();
	play();
}


function slower(){
	interval += 5;
	if (paused)
		return;
	stop();
	play()
}


document.onkeypress = (e) => {
	if (e.key === 's'){
		stop();
	}
	if (e.key === 'p'){
		play();
	}
	if (e.key === 'n'){
		next_generation();
	}
	if (e.key === 'x'){
		clear_grid();
	}
	if (e.key === 'r'){
		reset_grid();
	}
	if (e.key === '+'){
		faster();
	}
	if (e.key === '-'){
		slower();
	}
	grid_to_canvas();
}

canvas.onclick = (event) => {
	generations = 0;
	print_generations();
	stop();
	bb = canvas.getBoundingClientRect(); 
	let x = (event.clientX-bb.left)*(canvas.width/bb.width);
	let y = (event.clientY-bb.top)*(canvas.height/bb.height);
	let col = Math.floor(x/cell_width);
	let row = Math.floor(y/cell_width);
	grid[row][col] ^= 1;
	temp[row][col] ^= 1;
	save_grid();
	clear();
	grid_to_canvas();
}

init();
