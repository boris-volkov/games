
const canvas = document.querySelector("#canvas");

let grid_size = 64;
let cell_width = 16;

let grid = new Array(grid_size);
let temp = new Array(grid_size);
let undo_grid = new Array(grid_size);

for (let i = 0; i < grid.length; i++){
	grid[i] = new Array(grid_size).fill(0);
	temp[i] = new Array(grid_size).fill(0);	
	undo_grid[i] = new Array(grid_size).fill(0);	
}

canvas.height = grid.length * cell_width;
canvas.width = grid[0].length * cell_width;
const c = canvas.getContext("2d");

function next_generation(){
	/*
	Any live cell with fewer than two live neighbours dies, as if by underpopulation.
	Any live cell with two or three live neighbours lives on to the next generation.
	Any live cell with more than three live neighbours dies, as if by overpopulation.
	Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	*/
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
	grid_to_canvas();
}

Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

function count_neighbors(row, col) {
	let up = (row-1).mod(grid_size);
	let down = (row+1).mod(grid_size);
	let left = (col-1).mod(grid_size);
	let right = (col+1).mod(grid_size);
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

function clear() {
	c.fillStyle = "rgba(16,32,48,1)";
	c.fillRect(0,0, canvas.width, canvas.height);
	c.fillStyle = "rgba(20,40,60,1)";
	for (let row = 0; row < grid.length; row++)
		for (let col = 0; col < grid[0].length; col++)
			c.fillRect(cell_width*col + 2, cell_width*row + 2, cell_width-4, cell_width-4);
}     

function grid_to_canvas() {
	clear();
	c.fillStyle = "white";
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			if (grid[row][col] === 1)
				c.fillRect(cell_width*col + 2, cell_width*row + 2, cell_width-4, cell_width-4);
		}
	}
}

function init(){
	c.fillStyle = "rgba(50,60,130,1)";
	c.fillRect(0,0, canvas.width, canvas.height);
	grid_to_canvas();
}

function clear_grid(){
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col]= 0;
			temp[row][col]= 0;
		}
	}
}

function save_grid(){
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			undo_grid[row][col]= grid[row][col];
		}
	}
}

function reset_grid(){
	for (let row = 0; row < grid.length; row++){
		for (let col = 0; col < grid[0].length; col++){
			grid[row][col] = undo_grid[row][col];
			temp[row][col] = undo_grid[row][col];
		}
	}
}

function pause(){
		clearInterval(id)
}

function start(){
		id = setInterval( next_generation, 50);
}


let id;
document.onkeypress = (e) => {
	if (e.key === 'p'){
		pause();
	}
	if (e.key === 's'){
		save_grid();
		start();
	}
	if (e.key === 'n'){
		next_generation();
	}
	if (e.key === 'x'){
		clear_grid();
	}
	if (e.key === 'r'){
		pause();
		reset_grid();
	}
	grid_to_canvas();
}

canvas.onclick = (event) => {
	pause();
	bb = canvas.getBoundingClientRect(); 
	let x = (event.clientX-bb.left)*(canvas.width/bb.width);
	let y = (event.clientY-bb.top)*(canvas.height/bb.height);
	let col = Math.floor(x/cell_width);
	let row = Math.floor(y/cell_width);
	grid[row][col] ^= 1;
	grid_to_canvas();
}

init();
