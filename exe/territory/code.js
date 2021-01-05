const canvas = document.querySelector("#canvas");

let grid_size = 16;

let grid = Array(grid_size);
grid.width = grid_size;
grid.height = grid_size;
function initialize_grid() {
	for (let i = 0; i < grid.height; i++){
		grid[i] = Array(grid.width);
		for (let j = 0; j < grid.width; j++){
			grid[i][j] = 0;
		}
	}	
}

initialize_grid();


let backup_board = Array(21);
for (let i = 0; i < grid.height; i++){
	backup_board[i] = Array(grid.width);
	for (let j = 0; j < grid.width; j++){
		backup_board[i][j] = 0;
	}
}	

function count_blue(){
	let count = 0;
	for (let i = 0; i < grid.height; i++){
		for (let j = 0; j < grid.width; j++){
			if (grid[i][j] == 1)
				count++;
		}
	}	
	return count;
}


function count_pink(){
	let count = 0;
	for (let i = 0; i < grid.height; i++){
		for (let j = 0; j < grid.width; j++){
			if (grid[i][j] == 11)
				count++;
		}
	}	
	return count;
}

function draw_dot(i,j){
	let x = i*square.w;
	let y = j*square.h;
	x += square.w/2
	y += square.w/2
	ctx.beginPath();
	ctx.arc(x,y,5,0,2*Math.PI,false);
	ctx.fillStyle = "rgb(36,58,80)";
	ctx.fill();
}

function grid_info(){	
	let temp = ctx.fillStyle; 						// save previous color
	for (let i = 0; i < grid.height; i++){
		for (let j = 0; j < grid.width; j++){
			ctx.fillText(grid[i][j], i*square.w, j*square.h);
		}
	}
	ctx.fillStyle = temp; 							// reset previous color
}
	

canvas.height = 760; // pick whatever dimensions fit on your screen
canvas.width = 760;
const ctx = canvas.getContext("2d");

let shift_amount = canvas.height/grid.width*2;

// only these first four lines are really necessary to get the canvas going
// everything following is just examples of how to use the methods
// you can look up all the available methods at: 
// https://www.w3schools.com/html/html5_canvas.asp

// this clear function can be called any time to clear the canvas
function clear(x = 0, y = 0, w = canvas.width, h = canvas.height){
	let temp = ctx.fillStyle; 						// save previous color
	ctx.fillStyle = "rgb(33,55,77)"; 			// background color
	ctx.fillRect(x,y, w, h); // fills over entire canvas
	ctx.fillStyle = temp; 							// reset previous color
}
clear();

function blue_square(x = square_blue.x, y = square_blue.y){
	ctx.fillStyle = "#369";
	im = Math.round(square.w/4) 
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
	ctx.fillStyle = "#6ae";
	im = Math.round(square.w/3) 
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
	x += square.w/2
	y += square.w/2
	ctx.beginPath();
	ctx.arc(x,y,5,0,2*Math.PI,false);
	ctx.fillStyle = "#adf";
	ctx.fill();
}
function pink_square(x = square_pink.x, y = square_pink.y){
	ctx.fillStyle = "#636";
	im = Math.round(square.w/4) 
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
	ctx.fillStyle = "#b8b";
	im = Math.round(square.w/3) 
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
	x += square.w/2
	y += square.w/2
	ctx.beginPath();
	ctx.arc(x,y,5,0,2*Math.PI,false);
	ctx.fillStyle = "#fdf";
	ctx.fill();
}

function bright_blue(x = square_blue.x, y = square_blue.y){
	ctx.fillStyle = "#123";
	im = Math.round(square.w/3); 
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
}

function bright_pink(x = square_pink.x, y = square_pink.y){
	ctx.fillStyle = "#313";
	im = Math.round(square.w/3); 
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
}

function white_square(x = square.x, y = square.y){
	ctx.fillStyle = "#fff";
	im = Math.round(square.w/3);
	ctx.fillRect(x + im, y + im, square.w - 2*im, square.h -2*im);
}


let locked = 0;

// do a search out from the current location
// mark potential regions


//----------------------------------------------------------

function solve_pink(board) {
	// what happens when it finds a blue region?
	if (!board.length) return;

	// change every square connected to left and right borders from O to temporary #
	for (let i = 0; i < board.length; i++) {
		mark_pink(board, i, 0);
		mark_pink(board, i, board[0].length - 1);
	}

	// change every square connected to top and bottom borders from O to temporary #
	for (let i = 1; i < board[0].length - 1; i++) {
		mark_pink(board, 0, i);
		mark_pink(board, board.length - 1, i);
	}

	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0].length; j++) {
			// change the rest of O to X
			if (board[i][j] === 0 || board[i][j] === 1) board[i][j] = 11;

			// change temporary # back to O
			// TODO this is not correct here.. should change back to what it was. 
			if (board[i][j] === 12){
				board[i][j] = backup_board[i][j];
			}
		}
	}
}

function mark_pink(board, i ,j) {
	if (i < 0 || i > board.length - 1 || j < 0 || j > board[0].length - 1) return;
	if (board[i][j] == 11 || board[i][j] === 12) return;

	backup_board[i][j] = board[i][j];
	board[i][j] = 12;

	mark_pink(board, i - 1, j);
	mark_pink(board, i + 1, j);
	mark_pink(board, i, j - 1);
	mark_pink(board, i, j + 1);
}


function solve_blue(board) {
	if (!board.length) return;

	// change every square connected to left and right borders from O to temporary #
	for (let i = 0; i < board.length; i++) {
		mark_blue(board, i, 0);
		mark_blue(board, i, board[0].length - 1);
	}

	// change every square connected to top and bottom borders from O to temporary #
	for (let i = 1; i < board[0].length - 1; i++) {
		mark_blue(board, 0, i);
		mark_blue(board, board.length - 1, i);
	}

	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0].length; j++) {
			// change the rest of O to X
			if (board[i][j] === 0 || board[i][j] === 11) board[i][j] = 1;

			// change temporary # back to O
			if (board[i][j] === 2){
				board[i][j] = backup_board[i][j];
			}
		}
	}
}

function mark_blue(board, i ,j) {
	if (i < 0 || i > board.length - 1 || j < 0 || j > board[0].length - 1) return;
	if (board[i][j] == 1 || board[i][j] == 2) return;

	backup_board[i][j] = board[i][j];
	board[i][j] = 2;

	mark_blue(board, i - 1, j);
	mark_blue(board, i + 1, j);
	mark_blue(board, i, j - 1);
	mark_blue(board, i, j + 1);
}


function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( num < 0 ) {
        zeroString = '-' + zeroString;
    }

    return zeroString+n;
}

//-------------------------------------------------------------------

let offset = 4;

const square_blue = {
	i : offset,
	j : offset,
	x : canvas.width / grid.width * offset,
	y : canvas.width / grid.width * offset,
	w : canvas.width / grid.width,
	h : canvas.height/ grid.height,
}

const square_pink = {
	i : grid.width-offset-1,
	j : grid.width-offset-1,
	x : canvas.width / grid.width * (grid.width-offset-1),
	y : canvas.width / grid.width * (grid.width-offset-1),
	w : canvas.width / grid.width,
	h : canvas.height/ grid.height,
}

let square = square_pink;

//ctx.fillRect(square.x, square.y, square.w, square.h);
grid[square_blue.i][square_blue.j] = 1;
grid[square_pink.i][square_pink.j] = 11;
grid_to_canvas();
blue_square();
pink_square();
white_square();

function grid_to_canvas(){
	for (let i = 0; i < grid.width; i++){
		for(let j = 0; j < grid.height; j++){
			bright_blue();
			bright_pink();
			if (grid[i][j] === 0)
				draw_dot(i,j);
			if (i === square.i && j === square.j){
				ctx.globalAlpha = 1;
				white_square(i*square.w, j*square.h);
			}
			if (grid[i][j] === 1)
				blue_square(i*square.w, j*square.h);
			if (grid[i][j] === 11)
				pink_square(i*square.w, j*square.h);
		}
	}
}


document.addEventListener("keydown", (e) => {
	if (locked === 1) return 0;
	if (e.key === 'w' && square === square_blue){ // and not returning to last square.
		if (square.j > 1 && grid[square.i][square.j - 2] != 11){
			grid[square.i][square.j - 0] = 1;
			grid[square.i][square.j - 1] = 1;
			square.j -= 2;
			grid[square.i][square.j] = 1;
			solve_blue(grid);
			slide_square(square.x, square.y - shift_amount);
		}
	}

	if (e.key === "s" && square === square_blue){
		if (square.j + 2 < grid.height && grid[square.i][square.j + 2] != 11){
			grid[square.i][square.j + 0] = 1;
			grid[square.i][square.j + 1] = 1;
			square.j += 2;
			grid[square.i][square.j] = 1;
			solve_blue(grid);
			slide_square(square.x, square.y + shift_amount);
		}
	}

	if (e.key === "a" && square === square_blue){
		if (square.i > 1 && grid[square.i - 2][square.j] != 11){
			grid[square.i - 0][square.j] = 1;
			grid[square.i - 1][square.j] = 1;
			square.i -= 2;
			grid[square.i][square.j] = 1;
			solve_blue(grid);
			slide_square(square.x - shift_amount, square.y);
		}
	}

	if (e.key === "d" && square === square_blue){
		if (square.i + 2 < grid.width && grid[square.i + 2][square.j] != 11){
			grid[square.i + 0][square.j] = 1;
			grid[square.i + 1][square.j] = 1;
			square.i += 2;
			grid[square.i][square.j] = 1;
			solve_blue(grid);
			slide_square(square.x + shift_amount, square.y);
		}
	}

	if (e.key === "ArrowUp"&&square === square_pink){
		if (square.j > 1 && grid[square.i][square.j - 2] != 1){
			slide_square(square.x, square.y - shift_amount);
			grid[square.i][square.j - 0] = 11;
			grid[square.i][square.j - 1] = 11;
			square.j -= 2;
			solve_pink(grid);
			grid[square.i][square.j] = 11;
		}
	}

	if (e.key === "ArrowDown"&&square === square_pink){
		if (square.j + 2 < grid.height && grid[square.i][square.j + 2] != 1){
			grid[square.i][square.j + 0] = 11;
			grid[square.i][square.j + 1] = 11;
			square.j += 2;
			grid[square.i][square.j] = 11;
			solve_pink(grid);
			slide_square(square.x, square.y + shift_amount);
		}
	}

	if (e.key === "ArrowLeft"&&square === square_pink){
		if (square.i > 1 && grid[square.i-2][square.j] != 1){
			grid[square.i - 0][square.j] = 11;
			grid[square.i - 1][square.j] = 11;
			square.i -= 2;
			grid[square.i][square.j] = 11;
			solve_pink(grid);
			slide_square(square.x - shift_amount, square.y);
		}
	}

	if (e.key === "ArrowRight" && square === square_pink){
		if (square.i + 2 < canvas.width && grid[square.i + 2][square.j] != 1){
			grid[square.i + 0][square.j] = 11;
			grid[square.i + 1][square.j] = 11;
			square.i += 2;
			grid[square.i][square.j] = 11;
			solve_pink(grid);
			slide_square(square.x + shift_amount, square.y);
		}
	}
});	

function slide_square(x, y) {
	locked = 1;
	let frames = 16;
	let dx = (x - square.x)/frames;
	let dy = (y - square.y)/frames;
	let counter = 0;
	let id = setInterval( () => {
		square.x += dx;
		square.y += dy;
		ctx.fillStyle = "#fff";
		ctx.globalAlpha = counter/frames;
		if (square === square_pink)
			bright_pink();
		else
			bright_blue();
		counter ++;
		if (counter === frames){
			clearInterval(id);
			ctx.globalAlpha = 1;
			grid_to_canvas();
			if (square === square_blue){
				document.querySelector("#blue_score").innerHTML = zeroPad(count_blue(),3); 
				square = square_pink;
				pink_square();
			}
			else {
				document.querySelector("#pink_score").innerHTML = zeroPad(count_pink(),3);; 
				square = square_blue;
				blue_square();
			}
			white_square();
			console.log(grid);
			locked = 0;
		}
	}, 16);
}
