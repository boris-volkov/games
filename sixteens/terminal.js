// A fully custom terminal interface with some very strange capabilities.

/*
 * TODO make an equalize utility to bring colors back to normal
 * unscramble the matrix.
 * keep a stack of commands and run their inveres
 * make function-inverse map
 * have it play back as an animation.
 **/

//----------------------------------------------------------------Initialization of canvas and grid
var canvas = document.getElementById('puzzle_space');
var context = canvas.getContext('2d');
const urlParams = new URLSearchParams(window.location.search);
var grid_size = parseInt( urlParams.get('size'));
if (isNaN(grid_size)) { grid_size = 32; }

//TODO make these independent... grid_size is one of the most commonly used
//numbers in the whole code
grid_width = 24;
grid_height = 24;


var grid = Array(grid_size);
function initialize_grid(){
	for (let i = 0; i < grid_size; i++){
		grid[i] = Array(grid_size);
		for (let j = 0; j < grid_size; j++){
			grid[i][j] = Array(2);
			grid[i][j][0] = i;
			grid[i][j][1] = -1;
		}
	}	
}
initialize_grid();
//--------------------------------------------------------------------------Color state and methods
function Color(name){
	this.name = name;
	this.amp = 0;
	this.freq = 6.283/grid_size;
	this.phase = 0;
	this.center = 0;
	this.toString = function () {
		return [ this.name   , 	'Mag:', this.amp, 
			'Frq:', Math.round(grid_size*this.freq/6.28*1000)/1000, 
			'Pha:', this.phase,     
			'Cen:', this.center].join(' ');
	};

	this.sin = function (x) {
		return Math.round(Math.sin(this.freq*(x+this.phase))*this.amp+this.center);
	};
};

var gradient = {
	red 		: new Color('[Red]'),
	grn 		: new Color('[Grn]'),
	blu 		: new Color('[Blu]'),
	rgb_codes	: new Array(grid_size),

	generate_codes  : function() {
		for (var i = 0; i < grid_size; ++i){
			this.rgb_codes[i] = ('rgb('+this.red.sin(i)+','+
				this.grn.sin(i)+','+
				this.blu.sin(i)+')');}
	}
};

var gradient;

function reset_colors() {	
	
		gradient.red 		= new Color('[Red]'),
		gradient.grn 		= new Color('[Grn]'),
		gradient.blu 		= new Color('[Blu]'),
		gradient.rgb_codes	= new Array(grid_size),

		gradient.generate_codes  = function() {
			for (var i = 0; i < grid_size; ++i){
				this.rgb_codes[i] = ('rgb('+this.red.sin(i)+','+
					this.grn.sin(i)+','+
					this.blu.sin(i)+')');}
				}

		gradient.generate_codes();
}


reset_colors();

//-----------------------------------------------------------------------------------Motion functions
function torus_up()		{let temp = grid.shift(); grid.push(temp);}
function torus_down()	{let temp = grid.pop(); grid.unshift(temp);}
function torus_left()	{for (let i = 0; i < grid_size; i++) 
	{let temp = grid[i].shift(); grid[i].push(temp)}}
function torus_right()	{for (let i = 0; i < grid_size; i++) 
	{let temp = grid[i].pop(); grid[i].unshift(temp)}}
function mobius_up()	{let temp = grid.shift(); grid.push(temp.reverse())}
function mobius_down()	{let temp = grid.pop(); grid.unshift(temp.reverse());}
function mobius_left()	{let row = []; for (let i = 0; i < grid_size; i++)
	{row.unshift(grid[i].shift());}
	for (let j = 0; j < grid_size; j++){grid[j].push(row[j]);}}
function mobius_right()	{let row = []; for (let i = 0; i < grid_size; i++)
	{row.unshift(grid[i].pop());}
	for (let j = 0; j < grid_size; j++){grid[j].unshift(row[j]);}}
function transpose() 	{grid =  grid[0].map((col, i) => grid.map(row => row[i]));}
//------------------------------------------------------------------------------Draw colors to canvas	
var display = false;
var cursor_color = '#369';
function grid_to_canvas(){
	var grid_div = canvas.width/grid_size;
	for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			let x = j * grid_div;
			let y = i * grid_div;
			let color = gradient.rgb_codes[grid[i][j][0]]; // color element
			context.fillStyle = color;
			if (insert_mode && cursor_row == i && cursor_col == j)
				context.fillStyle = cursor_color;
			context.fillRect(x , y, grid_div, grid_div);
			if (grid[i][j][1] != -1){
				context.fillStyle = "#FFF";
				if ("$₽".includes(grid[i][j][1])) context.fillStyle = '#369';
				context.fillText(grid[i][j][1], Math.round(x+grid_div/5), Math.round(y+grid_div/12));
			}
		}
	}
	if (display){
		context.fillStyle = '#FFF';
		context.textAlign = "center";
		context.fillText(gradient.red.toString(), canvas.width/2,   grid_div);
		context.fillText(gradient.grn.toString(), canvas.width/2, 2*grid_div);
		context.fillText(gradient.blu.toString(), canvas.width/2, 3*grid_div);
		context.textAlign = "start";
	}
}	

function red(){
	echo(gradient.red.toString());
}

//----------------------------------------------------------key event listener & key -> function maps

var keys_down = {
	'r': false, 	'g': false,  	'b': false, 	'p': false,
	'f': false,		'm': false, 	'c': false, 	'e': false
};

var cursor_col = 0;
var cursor_row = 0;
var insert_mode = true;

function write(key) {
	grid[cursor_row][cursor_col][1] = key;
	var grid_div = canvas.width/grid_size;
	//context.fillText(key, cursor_col*grid_div, cursor_row*grid_div);
	if (cursor_col == grid_size - 1){
		cursor_col = 0;
		cursor_row = (cursor_row+1)%grid_size;
	} else {
		cursor_col += 1;
	}
	grid_to_canvas();
}

const key_function_map = {
	'*': () => { insert_mode ^= true; grid_to_canvas();},
	'i': torus_up,		'k': torus_down,	'j': torus_left,
	'l': torus_right,	'w': mobius_up,		's': mobius_down,
	'a': mobius_left,	'd': mobius_right,      't': transpose,
	'.': () => { display ^= true }, '`': () => { alert(gradient.rgb_codes); },

	'ArrowUp' : () => 	{if (keys_down['r']){ 
		if (keys_down['f'])
			gradient.red.freq *= 1.01;
		if (keys_down['p'])
			gradient.red.phase += 1;
		if (keys_down['m'])
			gradient.red.amp += 5;
		if (keys_down['c'])
			gradient.red.center += 5;
	}
		if (keys_down['g']){ 
			if (keys_down['f'])
				gradient.grn.freq *= 1.01;
			if (keys_down['p'])
				gradient.grn.phase += 1;
			if (keys_down['m'])
				gradient.grn.amp += 5;
			if (keys_down['c'])
				gradient.grn.center += 5;
		}
		if (keys_down['b']){ 
			if (keys_down['f'])
				gradient.blu.freq *= 1.01;
			if (keys_down['p'])
				gradient.blu.phase += 1;
			if (keys_down['m'])
				gradient.blu.amp += 5;
			if (keys_down['c'])
				gradient.blu.center += 5;
		}
	},

	'ArrowDown' : () => 	{if (keys_down['r']){ 
		if (keys_down['f'])
			gradient.red.freq /= 1.01;
		if (keys_down['p'])
			gradient.red.phase -= 1;
		if (keys_down['m'])
			gradient.red.amp -= 5;
		if (keys_down['c'])
			gradient.red.center -= 5;
	}
		if (keys_down['g']){ 
			if (keys_down['f'])
				gradient.grn.freq /= 1.01;
			if (keys_down['p'])
				gradient.grn.phase -= 1;
			if (keys_down['m'])
				gradient.grn.amp -= 5;
			if (keys_down['c'])
				gradient.grn.center -= 5;
		}
		if (keys_down['b']){ 
			if (keys_down['f'])
				gradient.blu.freq /= 1.01;
			if (keys_down['p'])
				gradient.blu.phase -= 1;
			if (keys_down['m'])
				gradient.blu.amp -= 5;
			if (keys_down['c'])
				gradient.blu.center -= 5;
		}
	}
};

// to fix negative cursor indices...
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

function cursor_up(){
	cursor_row = (cursor_row-1).mod(grid_size);
	grid_to_canvas();
}
function cursor_down(){
	cursor_row = (cursor_row+1)%grid_size;
	grid_to_canvas();
}
function cursor_right(){
	cursor_col = (cursor_col+1)%grid_size;
	grid_to_canvas();
}
function cursor_left(){
	cursor_col = (cursor_col-1).mod(grid_size);
	grid_to_canvas();
}

function back_space(){
	if (cursor_col > 0){
		grid[cursor_row][--cursor_col][1] = -1;
		grid_to_canvas();
	}
}

function forward_space(){
	if (cursor_col < grid_size-1){
		grid[cursor_row][++cursor_col][1] = -1;
		grid_to_canvas();
	}
}

function tab(){
	cursor_col = (cursor_col+4)%grid_size;
	grid_to_canvas();
}

function clear(){
	for (let row = 0; row < grid_size; row++)
		for (let col = 0; col < grid_size; col++)
			grid[row][col][1] = -1;
	cursor_row = 0;
	cursor_col = 0;
}

var ps1 = "$";
function prompt(){
	write(ps1); 
	cursor_col++;
}

function echo(buffer) {
	for (let i = 0; i < buffer.length; i++)
		write(buffer[i]);
	cursor_row = (cursor_row+1)%grid_size;
	cursor_col = 0;
}

function rgb(){
	alert(gradient.rgb_codes);
}

function unscramble(){
	initialize_grid();
	gradient.generate_codes();
	cursor_row = 0;
	cursor_col = 0;
	grid_to_canvas();
}

command_list = ["clear", "echo", "help", "reset", "rgb", "undo", "unscramble"];

function help(){
	echo('Available commands');
	echo('―'.repeat(18));
	for (let i = 0; i<command_list.length; i++)
		echo("· " + command_list[i]);
}

function execute_command(buffer) {
	let command = buffer.join("");
	if (command == "clear") clear();
	if (command.startsWith("echo ")) echo(buffer.slice(5));
	if (command == "help") help();
	if (command == "rgb") rgb();
	if (command == "unscramble") unscramble();
	if (command == "reset") reset_colors();
	if (command == "red") red();
	if (command == "rubles") ps1 = "₽";
	if (command == "dollars") ps1 = "$";
	if (command == "undo") grid = JSON.parse(JSON.stringify(b_grid));
}

var b_grid;
function backup_grid() {
	b_grid = JSON.parse(JSON.stringify(grid))
	return 0;
}

var buffer = [] /* IMPORTANT : input buffer  */
window.addEventListener('keydown', (event) => {

	if (insert_mode == true){
		if (event.key == 'Escape'){
			backup_grid();
			insert_mode = false;
			grid_to_canvas();
			return;
		}
		if (event.key == 'Enter'){
			cursor_col = 0;
			cursor_row = (cursor_row+1).mod(grid_size);
			execute_command(Array.from(buffer));
			buffer = [];
			prompt();
			grid_to_canvas();
			return;
		}
		if (event.key == 'Backspace'){
			if (buffer.length)
				buffer.pop();
			back_space();
			return;
		}
		if (event.key == 'Delete'){
			forward_space();
			return;
		}
		if (event.key == 'ArrowUp'){
			cursor_up();
			return;
		}
		if (event.key == 'ArrowDown'){
			cursor_down();
			return;
		}
		if (event.key == 'ArrowRight'){
			cursor_right();
			return;
		}
		if (event.key == 'ArrowLeft'){
			cursor_left();
			return;
		}
		if (event.key == 'Tab'){
			tab();
			event.preventDefault();
			canvas.focus();
			return
		}
		if (event.key.length === 1){
			event.preventDefault();
			buffer.push(event.key);
			write(event.key);
		}
		return;
	}

	if (keys_down.hasOwnProperty(event.key)){
		keys_down[event.key] = true;
		//return;
	}
	key_function_map[event.key]();
	gradient.generate_codes();
	grid_to_canvas();
});

window.addEventListener('keyup', (event) => {
	if (keys_down.hasOwnProperty(event.key))
		keys_down[event.key] = false;
});


//-------------------------------------------------------Resize Event Listener
window.addEventListener("resize", draw_canvas);
window.addEventListener("onload", draw_canvas);
window.addEventListener("onload", canvas.focus);
window.addEventListener("onload", prompt());

function draw_canvas(){ //rename to resize?
	var context = canvas.getContext('2d');
	let square_side = Math.min(window.innerWidth, window.innerHeight) - 30;
	square_side -= square_side%(grid_size); 
	canvas.setAttribute('width', square_side.toString()); 
	canvas.setAttribute('height',square_side.toString());
	canvas.width = canvas.width; canvas.height = canvas.height;
	context.textAlign = "start";
	context.textBaseline = "top";
	let font_size_pixels = Math.round(square_side/grid_size*0.8);
	context.font = "900 " + font_size_pixels+"px Courier New";
	grid_to_canvas();
}
gradient.generate_codes();
draw_canvas();
