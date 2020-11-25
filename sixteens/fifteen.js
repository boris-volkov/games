// Get the canvas element using the DOM
let canvas = document.getElementById('puzzle_space');
let context = canvas.getContext('2d');
let grid = 	[
			[1 ,2 ,3 ,4 ],
			[5 ,6 ,7 ,8 ],
			[9 ,10,11,12],
			[13,14,15,0]
		];
const colors = 	["#b13", "#136", "#69b", "#369"];

let empty_row = 3;
let empty_col = 3;

function move(key){
	if (key === 'ArrowDown' || key === 's')
		if (empty_row > 0){
			grid[empty_row][empty_col] = grid[empty_row-1][empty_col];
			grid[--empty_row][empty_col] = 0;
		}
	if (key === 'ArrowUp' || key === 'w')
		if (empty_row < 3){
			grid[empty_row][empty_col] = grid[empty_row+1][empty_col];
			grid[++empty_row][empty_col] = 0;
		}
	if (key === 'ArrowLeft' || key === 'a')
		if (empty_col < 3){
			grid[empty_row][empty_col] = grid[empty_row][empty_col+1];
			grid[empty_row][++empty_col] = 0;
		}
	if (key === 'ArrowRight' || key === 'd')
		if (empty_col > 0){
			grid[empty_row][empty_col] = grid[empty_row][empty_col-1];
			grid[empty_row][--empty_col] = 0;
		}
	if (key === '`')
		scramble();
}	



Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

function scramble(){
	let keys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
	let i = 0;
	let id = setInterval(automove, 30);

	function automove(){
		move(keys.sample());
		grid_to_canvas();
		i += 1
		if (i > 100)
			clearInterval(id);
	}
}

function grid_to_canvas(){
	let width = canvas.width;
	let fourth = width/4;
	let eighth = fourth/2;
	for (let i = 0; i < 4; i++){
		for (let j = 0; j < 4; j++){
			let x = j * fourth;
			let y = i * fourth;
			let number = grid[i][j];
			let color = colors[Math.floor((number-1) / 4)] || '#eee';
			context.fillStyle = color;
			context.fillRect(x, y, fourth, fourth);
			if (number !== 0){
				let text = number.toString();
				context.fillStyle = "#fff";
				context.fillText(text ,x + eighth, y + eighth);
			}
		}
	}
}	
//---------------------------------------key event listener

window.addEventListener('keydown', (event) => {
	move(event.key);
	grid_to_canvas();
}, false); //TODO what does this false mean?


//--------------------------------------resize event listener
window.addEventListener("resize", draw_canvas);
function draw_canvas(){
	let context = canvas.getContext('2d');
	let square_side = Math.min(window.innerWidth, window.innerHeight) - 30;
	square_side -= square_side%8; 
	canvas.setAttribute('width', square_side.toString()); 
	canvas.setAttribute('height',square_side.toString());
	canvas.width = canvas.width; canvas.height = canvas.height;
	let font_height_pix = Math.floor(canvas.width/12).toString();
	context.font = font_height_pix + "px Courier New";
	context.textAlign = "center";
	grid_to_canvas();
}

//TODO event listeners for touch events!

draw_canvas();

