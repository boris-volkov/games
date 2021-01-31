// calling all the elements from the html document for the bottom control bar.
// there they are just <div>'s but here we turn them into buttons
const step_button  = document.querySelector("#step");
const play_button  = document.querySelector("#play");
const stop_button  = document.querySelector("#stop");
const reset_button = document.querySelector("#reset");
const clear_button = document.querySelector("#clear");
const gen_display  = document.querySelector("#gen_display");
const random_button = document.querySelector("#randomize");

let paused      = true;// game starts off paused.
let interval    = 100; // milliseconds per generation
let generations = 0;   // generation counter, resets when adding new pieces

// initialize display
const canvas    = document.querySelector("#canvas");
let cell_width  = 20; // pixels on the display. will get squeezed to fit left-right

// get url params for grid size, or set default 40
const urlParams = new URLSearchParams(window.location.search);
var num_rows = parseInt( urlParams.get('rows'));
if (isNaN(num_rows)) { num_rows = 64; }
var num_cols = parseInt( urlParams.get('cols'));
if (isNaN(num_cols)) { num_cols = 64; }

// initialize grids
let grid      = new Array(num_rows);
let temp      = new Array(num_rows);
let undo_grid = new Array(num_rows);
for (let i = 0; i < num_rows; i++){
	grid[i]      = new Array(num_cols).fill(0);
	temp[i]      = new Array(num_cols).fill(0);	
	undo_grid[i] = new Array(num_cols).fill(0);	
}

// match graphics context to grid size
canvas.height = grid.length * cell_width;
canvas.width = grid[0].length * cell_width;
const c = canvas.getContext("2d"); 
// this c is important! it is your messenger to the screen.
// it is similar to the turtle in that you give it commands
// to draw things on the screen. Here, rectangles and circles.

// game logic
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
				else 
					temp[row][col] = 0;
			}	
		}
	}
	for (let row = 0; row < grid.length; row++){ // write temp grid over main grid
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col] = temp[row][col]        
		}
	}
	// this function is responsible for calling its successors
	clear_transparent();
	grid_to_canvas();
	print_generations();
}
step_button.onclick = next_generation;


// because javascript % is strange
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

function count_neighbors(row, col) {
	// this stuff is to identify the grid as a Torus
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

// not on the page yet
function print_count(){
	live_counter.innerHTML = living;
}

c.strokeStyle = "#123";
c.lineWidth = 4;

function stroke_grid() {
	
	for (let row = 0; row < grid.length; row++){
		c.beginPath();
		c.moveTo(0, row*cell_width);
		c.lineTo(canvas.width, row*cell_width);
		c.stroke(); 
	}
	for (let col = 0; col < grid[0].length; col++){
		c.beginPath();
		c.moveTo(col*cell_width, 0);
		c.lineTo(col*cell_width, canvas.height);
		c.stroke(); 
	}
}

function clear() {
	c.fillStyle = "rgba(32,45,55,1)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	stroke_grid();
}

let opacity = 0.7;;
// the transparent fill is what gives the afterglow effect
function clear_transparent() {
	c.fillStyle = "rgba(32,45,55," + opacity + ")";
	c.fillRect(0, 0, canvas.width, canvas.height);
	stroke_grid();
}     

function raise_opacity() {
	opacity += 0.05;
	if (opacity > 1)
		opacity = 1;
}

function lower_opacity() {
	opacity -= 0.05;
	if (opacity <0)
		opacity = 0;
}

// drawing the circles that are alive
function grid_to_canvas() {
	c.fillStyle = "white";
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			if (grid[row][col] === 1){
				c.fillStyle = "#bfc";
				c.beginPath();
				c.arc(Math.round(col*cell_width + cell_width/2), 
					    Math.round(row*cell_width + cell_width/2),
					    Math.round(cell_width/3), 0, 2*Math.PI, false);
				c.fill();
			}
		}
	}
}

// initial condition of the screen
function init(){
	c.fillStyle = "#123";
	c.fillRect(0,0, canvas.width, canvas.height);
	clear();
	grid_to_canvas();
}


// utility functions
function clear_grid(){
	generations = 0;
	print_generations();
	stop();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col]= 0;
		}
	}
	clear();
	grid_to_canvas();
}
clear_button.onclick = clear_grid;

function save_grid(){
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			undo_grid[row][col]= grid[row][col];
		}
	}
}

function reset_grid(){
	generations = 0;
	print_generations();
	stop();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col] = undo_grid[row][col];
		}
	}
	clear();
	grid_to_canvas();
}

function randomize(){
	stop();
	generations = 0;
	print_generations();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			let choice;
			if (Math.random() < 0.2)
				choice = 1;
			else
				choice = 0;
			grid[row][col] = choice;
		}
	}
	clear();
	grid_to_canvas();
	save_grid();
}

random_button.onclick = randomize;
reset_button.onclick = reset_grid;

let id;
function stop(){
	if (!paused)
		clearInterval(id);
	paused = true;
}

stop_button.onclick = stop;

function play(){
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
	play();
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
	if (e.key === '?'){
		randomize();
	}
	if (e.key === '['){
		raise_opacity();
	}
	if (e.key === ']'){
		lower_opacity();
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
	save_grid();
	clear();
	grid_to_canvas();
}

init();
