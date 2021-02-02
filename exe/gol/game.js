// calling all the elements from the html document for the bottom control bar.
// there they are just <div>'s but here we turn them into buttons
const step_button   = document.querySelector("#step");
const play_button   = document.querySelector("#play");
const stop_button   = document.querySelector("#stop");
const reset_button  = document.querySelector("#reset");
const clear_button  = document.querySelector("#clear");
const gen_display   = document.querySelector("#gen_display");
const random_button = document.querySelector("#randomize");

let paused      = true;// game starts off paused.
let interval    = 100; // milliseconds per generation
let generations = 0;   // generation counter, resets when adding new pieces
let trail = 1;

// initialize display
const canvas    = document.querySelector("#canvas");
let cell_width  = 16; // pixels on the display

// get url params for grid size, or set default 40
const urlParams = new URLSearchParams(window.location.search);
var num_rows = parseInt( urlParams.get('rows'));
if (isNaN(num_rows)) { num_rows = 64; }
var num_cols = parseInt( urlParams.get('cols'));
if (isNaN(num_cols)) { num_cols = 64; }

// initialize grids
let grid = new Array(num_rows);
for (let i = 0; i < num_rows; i++){
	grid[i] = new Array(num_cols);
	for (let j = 0; j < num_cols; j++)
		grid[i][j] = new Uint8Array(4).fill(0); 
		// current, temp, undo, neighbor count
} // storing relevant things closer in memory for performance

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
	if (trail)
		clear_transparent();
	else
		clear();
	count_neighbors();
	for (let row = 0; row < grid.length; row++){ // make new generation
		for (let col = 0; col < grid[0].length; col++){
			count = grid[row][col][3];
			if (grid[row][col][0] === 1){ // alive
				if (count < 2)
					grid[row][col][1] = 0;
				else if (count <= 3)
					grid[row][col][1] = 1;
				else 
					grid[row][col][1] = 0;

			} else { // if dead
				if (count === 3)
					grid[row][col][1] = 1;
				else 
					grid[row][col][1] = 0;
			}	
		}
	}
	c.fillStyle = "#bfc";
	for (let row = 0; row < grid.length; row++){ // write temp to current state
		for (let col = 0; col < grid[0].length; col++){
			if (grid[row][col][0] = grid[row][col][1] === 1){
				// instead of iterating again to call grid to canvas, we already
				// know which squares to light up here.
				c.beginPath();
				c.arc(Math.round(col*cell_width + cell_width/2), 
					    Math.round(row*cell_width + cell_width/2),
					    Math.round(cell_width/3), 0, 2*Math.PI, false);
				c.fill();
			}
			grid[row][col][3] = 0; // reset neighbor count for next time
		}
	}
	print_generations();
}
step_button.onclick = next_generation;

function count_neighbors() {
	for (let row = 0; row < num_rows; row++){
		let up    = (row === 0) ? num_rows-1 : row - 1;
		let down  = (row === num_rows-1) ? 0 : row + 1;
		for (let col = 0; col < num_cols; col++){
			if (grid[row][col][0] == 0) // only do the work for living cells
				continue;
			let left  = (col === 0) ? num_cols-1 : col - 1;
			let right = (col === num_cols-1) ? 0 : col + 1;
			grid[up][right][3]  ++
			grid[up][col][3]    ++ 
			grid[up][left][3]   ++ 
			grid[row][right][3] ++
			grid[row][left][3]  ++
			grid[down][col][3]  ++
			grid[down][right][3]++
			grid[down][left][3] ++
		}
	}
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
	if (num_rows < 256 && num_cols < 256) // for performance
		stroke_grid();
}

// the transparent fill is what gives the afterglow effect
// this is suprisingly the main bottleneck for the whole program
// this may be a good candidate for web workers to fill the canvas
// in tiles?
let opacity = 0.7;
function clear_transparent() {
	c.fillStyle = "rgba(32,45,55," + opacity + ")";
	c.fillRect(0, 0, canvas.width, canvas.height);
	if (num_rows < 256 && num_cols < 256) // for performance
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
	c.fillStyle = "#bfc";
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			if (grid[row][col][0] === 1){
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
}


// utility functions
function clear_grid(){
	generations = 0;
	print_generations();
	stop();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col][0]= 0;
		}
	}
	clear();
}
clear_button.onclick = clear_grid;

function save_grid(){
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col][2] = grid[row][col][0];
		}
	}
}

function reset_grid(){
	generations = 0;
	print_generations();
	stop();
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			// write undo slot into the current gen slot
			grid[row][col][0] = grid[row][col][2];
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
			if (Math.random() < 0.2)
				grid[row][col][0] = 1;
			else
				grid[row][col][0] = 0;
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
	if (e.key === 't'){
		trail ^= 1; // toggle 0 <-> 1
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
	grid[row][col][0] ^= 1;
	save_grid();
	clear();
	grid_to_canvas();
}

init();
