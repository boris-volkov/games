// A fully custom terminal interface with some very strange capabilities.

/*
 * TODO
 * keep a stack of commands and run their inveres
 * make function-inverse map
 * have it play back as an animation.
 **/

//----------------------------------------------------------------Initialization of canvas and grid
var canvas = document.getElementById('terminal');
var context = canvas.getContext('2d');
const urlParams = new URLSearchParams(window.location.search);
var grid_size = parseInt( urlParams.get('size'));
if (isNaN(grid_size)) { grid_size = 32; }

var drawing_mode = false;
var pen_down = false;
var bb;
canvas.onpointerdown = (event) => {
	if (drawing_mode){
		pen_down = true;
		bb = canvas.getBoundingClientRect(); 
		let x = (event.clientX-bb.left)*(canvas.width/bb.width);
		let y = (event.clientY-bb.top)*(canvas.height/bb.height);
		context.moveTo(x,y);
		context.strokeStyle = "#369";
	}
}

canvas.onpointermove = draw_handler;

canvas.onpointerup = () => {
		context.closePath();
		pen_down = false;
}

function draw_handler(event){
	if (pen_down){
			let x = (event.clientX-bb.left)*(canvas.width/bb.width);
			let y = (event.clientY-bb.top)*(canvas.height/bb.height);
			context.lineTo(x,y);
			context.stroke();
			context.moveTo(x,y);
	}
}

var num_cols = grid_size;
var num_rows = grid_size;

var term_memory = [];
var forward_memory = [];

var backup_history = [];
var backup_future = [];

var text_matrix = Array(num_rows); 
function initialize_text_matrix(){
	for (let i = 0; i < num_rows; i++)
		text_matrix[i] = Array(num_cols).fill(-1);
}

var grid = Array(num_rows);
function initialize_grid(){
	for (let i = 0; i < num_rows; i++){
		grid[i] = Array(num_cols);
		for (let j = 0; j < num_cols; j++){
			grid[i][j] = [i,j];
		}
	}	
}

// for mapping from the grid to the text_matrix:
function text_map(i,j) { 
	return text_matrix[grid[i][j][0]][grid[i][j][1]];
}

initialize_text_matrix();
initialize_grid();
//----------------------------------------------------------------Everything related to colors.
function Color(name){
	this.name = name;
	this.amp = 0;
	this.freq = 6.283/num_rows;
	this.phase = 0;
	this.center = 0;
	this.toString = function () {
		return [ this.name   , 	'Mag:', this.amp, '|',
			'Frq:', Math.round(grid_size*this.freq/6.28*1000)/1000, '|',
			'Pha:', this.phase,    '|', 
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
	rgb_codes	: new Array(num_rows),

	generate_codes  : function() {
		for (var i = 0; i < num_rows; ++i){
			this.rgb_codes[i] = ('rgb('+this.red.sin(i)+','+
				this.grn.sin(i)+','+
				this.blu.sin(i)+')');}
	}
};

function invert_color(string){
	return;
}

function reset_colors() {		
		gradient.red 		= new Color('[Red]'),
		gradient.grn 		= new Color('[Grn]'),
		gradient.blu 		= new Color('[Blu]'),
		gradient.rgb_codes	= new Array(num_rows),

		gradient.generate_codes  = function() {
			for (var i = 0; i < num_rows; ++i){
				this.rgb_codes[i] = ('rgb('+this.red.sin(i)+','+
					this.grn.sin(i)+','+
					this.blu.sin(i)+')');}
				}

		gradient.generate_codes();
}

function set_text_color(rgb) {
	if (isHexColor(rgb))
		text_color = "#" + rgb;
}

function isHexColor (hex) {
  return typeof hex === 'string'
      && (hex.length === 3 || hex.length === 6)
      && !isNaN(Number('0x' + hex))
}

function rgb(){
	alert(gradient.rgb_codes);
}


reset_colors();
//--------------------------------------------------------------Drawing to canvas.
var display = false;
var text_hidden = false;
var cursor_color = '#369';
var text_color = '#FFF';
function grid_to_canvas(){
	var grid_div = canvas.width/grid_size;
	var block_width = canvas.width/num_cols;
	var block_height  = canvas.height/num_rows;
	for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			let x = j * block_width;
			let y = i * block_height;
			let color = gradient.rgb_codes[grid[i][j][0]]; // color element
			context.fillStyle = color;
			if (text_hidden){
				context.fillRect(x , y, block_width, block_height);	
			} else {
				if (terminal_mode && cursor_row == grid[i][j][0] && cursor_col == grid[i][j][1])
					context.fillStyle = cursor_color;

				context.fillRect(x , y, grid_div, grid_div);
				
				if (text_map(i,j) != -1){ // need to draw char.
					context.fillStyle = text_color;
					if ("●◷◶→←―|".includes(text_map(i,j))) // orange special chars
						context.fillStyle = '#f60';
					if (":$₽".includes(text_map(i,j)))   // blue special chars
						context.fillStyle = "#369";
					context.fillText(text_map(i,j),Math.round(x+grid_div/4), Math.round(y+grid_div/5));
				}
			}
		}
	}

	//context.rotate(0.1); investigate this! this is how you get rotated characters bro!
	//context.translate(x,y)
	//context.transform(a,b,c,d,e,f) most advanced transformations
	if (display){
		context.fillStyle = '#FFF';
		context.textAlign = "center";
		context.fillText(gradient.red.toString(), canvas.width/2,   grid_div);
		context.fillText(gradient.grn.toString(), canvas.width/2, 2*grid_div);
		context.fillText(gradient.blu.toString(), canvas.width/2, 3*grid_div);
		context.textAlign = "start";
	}
}	
//----------------------------------------------------------key event listener & key -> function maps

var keys_down = {
	'r': false, 	'g': false,  	'b': false, 	'p': false,
	'f': false,		'm': false, 	'c': false, 	'e': false,
	'h': false,
};
const key_function_map = {
	'i': torus_up,		'k': torus_down,	'j': torus_left,
	'l': torus_right,	'w': mobius_up,		's': mobius_down,
	'a': mobius_left,	'd': mobius_right,      't': transpose,
	'.': () => { display ^= true; }, 
	'`': () => { alert(gradient.rgb_codes); },
	'h': () => { text_hidden ^= true; },
	'*': () => { terminal_mode ^= true; text_hidden = false;},

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
	if (cursor_row == 0 && term_memory.length)
		old_line();
	else cursor_row = Math.max(cursor_row - 1, 0);
}
function cursor_down(){
	if (cursor_row == (num_rows - 1) && forward_memory.length)
		back_from_the_future();
	else cursor_row = Math.min(cursor_row + 1, num_rows - 1);
}
function cursor_right(){
	cursor_col = (cursor_col+1)%grid_size;
}
function cursor_left(){
	cursor_col = (cursor_col-1).mod(grid_size);
}

function back_space(){
	if (cursor_col > 0)
		text_matrix[cursor_row][--cursor_col] = -1;
}

function delete_row(){
	//for (let i = 0; i < num_cols; i++)
	//	text_matrix[cursor_row][i] = -1;
	fit_canvas();
}

function tab(){
	cursor_col = (cursor_col+4)%grid_size;
}

function clear(){
	term_memory = [];
	forward_memory = [];
	initialize_text_matrix();
	cursor_row = 0;
	cursor_col = 0;
}

function waves(){
	echo(gradient.red.toString().replace(/\s/g,''));
	echo(gradient.grn.toString().replace(/\s/g,''));
	echo(gradient.blu.toString().replace(/\s/g,''));
}


//--------------------------------------------------Printing utility functions

var cursor_col = 0;
var cursor_row = 0;
var terminal_mode = true;
var text_mode = false;

function new_line() {
	term_memory.push(text_matrix.shift());
	text_matrix.push(Array(num_cols).fill(-1));
}

function old_line() {
	if (term_memory.length)
		text_matrix.unshift(term_memory.pop());
	forward_memory.push(text_matrix.pop());
}

function back_from_the_future() {
	if (forward_memory.length){
		term_memory.push(text_matrix.shift());
		text_matrix.push(forward_memory.pop());
	}
}

function write(key) {
	text_matrix[cursor_row][cursor_col] = key;
	//var grid_div = canvas.width/grid_size;
	//context.fillText(key, cursor_col*grid_div, cursor_row*grid_div);
	if (cursor_col == grid_size - 1){
		cursor_col = 0;
		if ((cursor_row + 1) == num_rows)
			new_line();
		else cursor_row = (cursor_row+1)%grid_size;
	} else {
		cursor_col += 1;
	}
}

function echo(buffer) {
	for (let i = 0; i < buffer.length; i++)
		write(buffer[i]);
	if (cursor_col > 0){ // linebreak after printing
		if ((cursor_row + 1) == num_rows)
			new_line();
		else cursor_row++;
		cursor_col = 0;
	}
}


var ps1 = "$";
function prompt(){
	if (ps1){
		write(ps1); 
		cursor_col++;
	}
}

//---------------------------------------------------------------Commands and maps
command_list = ["clear", "codes", "color [RGB] (hex)", "echo", 
				"help", "programs (listing)", "reboot", "reset (colors)", "rgb",
				"[esc] → phase mode", "[*]   → terminal mode",
				"[F1] terminal ←→ text edit"		
				];
// TODO pull from properties of command map rather than actually writing this list

program_list = ["quest", "princess", "sixteen"]

function help(title, list){ //TODO does not handle long lines
	echo(title + " ".repeat(grid_size-title.length));
	echo('●' + '―'.repeat(grid_size-2) + "●");
	for (let i = 0; i < list.length; i++)
		echo("| " + list[i] + " ".repeat(grid_size-list[i].length - 3) + "|");
	echo('●' + '―'.repeat(grid_size-2) + "●");
}


// put these in a function map
function execute_command(buffer) {
	let command = buffer.join("");
	if (command == "clear") 		clear();
	else if (command.startsWith("echo ")) 	echo(buffer.slice(5));
	else if (command == "help") 			help("Commands Available", command_list);
	else if (command == "programs")		help("Program Listing", program_list);
	else if (command == "codes") 		rgb();
	else if (command == "unscramble") 	initialize_grid();
	else if (command == "reset") 		reset_colors();
	else if (command == "rgb") 			waves();
	else if (command == "rubles") 		ps1 = "₽";
	else if (command == "dollars") 		ps1 = "$";
	//else if (command == "undo") 		grid = JSON.parse(JSON.stringify(b_grid));
	else if (command == "quest") 		quest();
	else if (command == "princess") 	princess();
	else if (command == "sixteen")		sixteen();
	else if (command == "reboot")		location.reload();
	else if (command == "rmps1")			ps1 = "";
	else if (command.startsWith("color "))	set_text_color(buffer.slice(6).join(''));
	else echo ("● Invalid command ● Type help ●");
}


var cursor_backup;
var b_grid; //backup grid

function backup(grid) {//TODO decide whether this is multi-purpose or not
	b_grid = JSON.parse(JSON.stringify(grid));
	backup_history = JSON.parse(JSON.stringify(term_memory));
	backup_future = JSON.parse(JSON.stringify(forward_memory));
	term_memory = [];
	forward_memory = [];
	return 0;
}


//TODO need separate handler for every mode this is getting bloated
var buffer = [] /* IMPORTANT : input buffer  */
window.addEventListener('keydown', (event) => {

	if (event.key == 'F2'){
		drawing_mode ^= true;
		return;
	}

	if (terminal_mode == true){
		if (event.key == 'Escape'){
			terminal_mode = false;
		}

		if (event.key == "F1"){
			if (text_mode){ // return to terminal mode
				ps1 = "$";
				text_mode = false;
				text_matrix = b_grid;
				cursor_row = cursor_backup[0];
				cursor_col = cursor_backup[1];
				term_memory = backup_history;
				forward_memory = backup_future;
			} else { // switch to text mode
				backup(text_matrix);
				cursor_backup = [cursor_row, cursor_col]
				clear();
				ps1 = "";
				text_mode = true;
			}
		}

		if (event.key == 'Enter'){
			cursor_col = 0;
			if ((cursor_row + 1) == num_rows)
				new_line();
			else cursor_row++;
			if (buffer.length && !text_mode){
				execute_command(Array.from(buffer));
			}
			buffer = [];
			prompt();
		}
		if (event.key == 'Backspace'){
			if (buffer.length && !text_mode)
				buffer.pop();
			back_space();
		}
		if (event.key == 'Delete'){
			delete_row();
		}
		if (event.key == 'ArrowUp'){
			cursor_up();
		}
		if (event.key == 'ArrowDown'){
			cursor_down();
		}
		if (event.key == 'ArrowRight'){
			cursor_right();
		}
		if (event.key == 'ArrowLeft'){
			cursor_left();
		}
		if (event.key == 'Tab'){
			tab();
			event.preventDefault();
		}
		if (event.key.length === 1){
			event.preventDefault();
			if (!text_mode)
				buffer.push(event.key);
			write(event.key);
		}
		grid_to_canvas();
		return;
	}

	if (keys_down.hasOwnProperty(event.key)){
		keys_down[event.key] = true;
	}
	if (key_function_map.hasOwnProperty(event.key))
		key_function_map[event.key]();

	gradient.generate_codes();
	grid_to_canvas();
});

window.addEventListener('keyup', (event) => {
	if (keys_down.hasOwnProperty(event.key))
		keys_down[event.key] = false;
});

//-------------------------------------------------------Resize Event Listener
window.addEventListener("resize", fit_canvas);
window.addEventListener("onload", fit_canvas);
window.addEventListener("onload", canvas.focus);
window.addEventListener("onload", prompt());

function fit_canvas(){ 
	context = canvas.getContext('2d');
	let square_side = Math.min(window.innerWidth, window.innerHeight) - 30;
	square_side -= square_side%(grid_size); 
	canvas.setAttribute('width', square_side.toString()); 
	canvas.setAttribute('height',square_side.toString());
	canvas.width = canvas.width; canvas.height = canvas.height;
	context.textAlign = "start";
	context.textBaseline = "top";
	context.lineCap = "round";
	context.lineJoin = "round";
	context.lineWidth = 3;
	let font_size_pixels = Math.round(square_side/grid_size*0.8);
	context.font = "Bold " + font_size_pixels+"px Courier";	
	grid_to_canvas();
}

function change_font(font) {
	return;
}

gradient.generate_codes();
fit_canvas();

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
//----------------------------------------------------------------------------------Out-links
function quest(){location.assign('./quest/quest.html');}
function princess(){ location.assign('./princess/rules.html');}
function sixteen(){ location.assign('./sixteens/sixteens.html');}
