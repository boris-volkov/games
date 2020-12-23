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
var num_rows = parseInt( urlParams.get('rows'));
if (isNaN(num_rows)) { num_rows = 32; }
var num_cols = parseInt( urlParams.get('cols'));
if (isNaN(num_cols)) { num_cols = 48; }

//-------------------------------------------------------stylus drawing listeners/handlers
var drawing_mode = false;
var pen_down = false;
var bb; // bounding box, to adjust x,y coordinates within the terminal.

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

canvas.onpointermove = (event) => {
	if (pen_down){
			let x = (event.clientX-bb.left)*(canvas.width/bb.width);
			let y = (event.clientY-bb.top)*(canvas.height/bb.height);
			context.lineTo(x,y);
			context.stroke();
			context.moveTo(x,y);
	}
}

canvas.onpointerup = () => {
		context.closePath();
		pen_down = false;
}
//---------------------------------------------Text matrix and color matrix with mapping

// backward and forward scroll stacks
var term_memory = [];
var forward_memory = [];

// backups for when going to text mode
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

//--------------------------------------------Printing and cursor functions:

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
	cursor_col = (cursor_col+1)%num_cols;
}
function cursor_left(){
	cursor_col = (cursor_col-1).mod(num_cols);
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
	cursor_col = (cursor_col+4)%num_cols;
}

function clear(){
	term_memory = [];
	forward_memory = [];
	initialize_text_matrix();
	cursor_row = 0;
	cursor_col = 0;
}

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
	if (cursor_col == num_cols - 1){
		cursor_col = 0;
		if ((cursor_row + 1) == num_rows)
			new_line();
		else cursor_row = (cursor_row+1)%num_rows;
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

const invalid_usage = "● Invalid usage ●";

function help(title, list){ //TODO does not handle long lines
	title = "::" + title + "::";
	echo(title + " ".repeat(num_cols-title.length));
	echo('●' + '―'.repeat(num_cols-2) + "●");
	for (let i = 0; i < list.length; i++)
		echo("| " + list[i] + " ".repeat(num_cols-list[i].length - 3) + "|");
	echo('●' + '―'.repeat(num_cols-2) + "●");
}


initialize_text_matrix();
initialize_grid();

function ls(){
	help("File Listing", Object.keys(file_list));
}

function cat(file_name) {
	if (file_list.hasOwnProperty(file_name))
		help(file_name, file_list[file_name]);
	else {
		echo(invalid_usage);
		echo("::cat must be called on a file");
		echo("::example usage: cat about");
		echo("::use ls to see a file listing");
		//echo("::use help cat to learn more");
	}
}
	
//---------------------------Everything related to color manipulation in phase mode: 
function Color(name){
	this.name = name;
	this.amp = 0;
	this.freq = 6.283/num_rows;
	this.phase = 0;
	this.center = 0;
	this.toString = function () {
		return [ this.name   , 	'Mag:', this.amp, '|',
			'Frq:', Math.round(num_rows*this.freq/6.28*100)/100, '|',
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
}

function waves(){
	echo(gradient.red.toString().replace(/\s/g,''));
	echo(gradient.grn.toString().replace(/\s/g,''));
	echo(gradient.blu.toString().replace(/\s/g,''));
}




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
	else {
		echo(invalid_usage);
		echo("::txtcolor must be called with an RGB hex code");
		echo("::example usage: txtcolor fff or txtcolor 3366ff");
	}
}

function isHexColor (hex) {
  return typeof hex === 'string'
      && (hex.length === 3 || hex.length === 6)
      && !isNaN(Number('0x' + hex))
}

function rgb(){ // to be depracated ?
	alert(gradient.rgb_codes);
} 
reset_colors();
//--------------------------------------------------------------Drawing to canvas.
var display = false;
var text_hidden = false;
var cursor_color = '#47a';
var text_color = '#69c';
function grid_to_canvas(){
	var ver_div = canvas.width/num_cols;
	var hor_div = canvas.height/num_rows;
	for (var i = 0; i < num_rows; i++){
		for (var j = 0; j < num_cols; j++){
			let x = j * hor_div;
			let y = i * ver_div;
			let color = gradient.rgb_codes[grid[i][j][0]]; // color element
			context.fillStyle = color;
			if (text_hidden){ // fill background no matter what
				context.fillRect(x , y, hor_div, ver_div);	
			} else { // otherwise fill background and text on top of it
				if (terminal_mode && cursor_row == grid[i][j][0] && cursor_col == grid[i][j][1])
					context.fillStyle = cursor_color;

				context.fillRect(x , y, hor_div, ver_div);
				let character = text_map(i,j);
				if (character != -1){ // need to draw char.
					context.fillStyle = text_color;
					if ("●◷◶→←―|↑↓_".includes(character)) // orange special chars
						context.fillStyle = '#f60';
					if (":$₽".includes(character))   // blue special chars
						context.fillStyle = "#369";
					if ("[](){}><+=-*/".includes(character))  // yellow special chars
						context.fillStyle = "#990";
					context.fillText(character, Math.round(x+hor_div/4), Math.round(y+ver_div/5));
				}
			}
		}
	}

	//context.rotate(0.1);
	//// investigate this! this is how you get rotated characters bro!
	//context.translate(x,y)
	//context.transform(a,b,c,d,e,f) most advanced transformations
	if (display){ // this is if color information display is turned on
		context.fillStyle = "#000";
		context.fillRect(Math.round(canvas.width/5) ,ver_div/2, Math.round(3*canvas.width/5), ver_div*4);
		context.textBaseline = "top";
		context.textAlign = "center";
		context.fillStyle = "#a33";
		context.fillText(gradient.red.toString(), canvas.width/2,   ver_div);
		context.fillStyle = "#3a3";
		context.fillText(gradient.grn.toString(), canvas.width/2, 2*ver_div);
		context.fillStyle = "#36f";
		context.fillText(gradient.blu.toString(), canvas.width/2, 3*ver_div);
		context.textAlign = "start";
	}
}	
//-------------------------------------------key event listener & key -> function maps

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
	'Escape': () => { terminal_mode ^= true; text_hidden = false; display = false},
	'=' :  reset_colors,

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
//---------------------------------------------------------------Commands and maps
command_list = ["about", "cat", "clear", "codes", "echo", 
				"help", "ls", "programs", "refresh", "rgb",
				"txtcolor",
				"[esc]  terminal mode ←→ phase mode" ,
				"[F1]   terminal mode ←→ text mode",		
				];
// TODO pull from properties of command map rather than actually writing this list

program_list = ["quest", "princess", "fifteen", "sixteen", "game", "territory"]

// put these in a function map
function execute_command(buffer) {
	let command = buffer.join("");
	if (command == "clear") 		clear();
	else if (command.startsWith("echo")) 	echo(buffer.slice(5));
	else if (command.startsWith("txtcolor"))	set_text_color(buffer.slice(9).join(''));
	else if (command.startsWith("cat"))    cat(buffer.slice(4).join(''));
	else if (command == "help") 			help("Commands Available", command_list);
	else if (command == "programs")		help("Program Listing", program_list);
	else if (command == "codes") 		rgb();
	else if (command == "about")        cat("about");
	else if (command == "unscramble") 	initialize_grid();
	else if (command == "reset") 		reset_colors();
	else if (command == "rgb") 			waves();
	else if (command == "rubles") 		ps1 = "₽";
	else if (command == "dollars") 		ps1 = "$";
	//else if (command == "undo") 		grid = JSON.parse(JSON.stringify(b_grid));
	else if (command == "quest") 		quest();
	else if (command == "game" )     	game();
	else if (command == "princess") 	princess();
	else if (command == "sixteen")		sixteen();
	else if (command == "fifteen")		fifteen();
	else if (command == "territory")    territory();
	else if (command == "refresh")		location.reload();
	else if (command == "rmps1")			ps1 = "";
	else if (command == "ls")			ls();
	else echo ("● Invalid command ● Type help ●");
}


var cursor_backup;
var b_grid; //backup grid

// everyone reccomends this for deep copy
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
			terminal_mode ^= true;
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

// when it tries to get as tall as possible to fit, there end up being
// extra cols on the right side

function fit_canvas(){// resizing this way is costly and clobbers anything that was drawn. 
	context = canvas.getContext('2d');
	let available_x_pixels = window.innerWidth-32;
	let available_y_pixels = window.innerHeight-32;
	let desired_ratio = num_cols/num_rows; //width to height
	let window_ratio = available_x_pixels/available_y_pixels;
	let actual_width = 0;
	let actual_height = 0;
	if (desired_ratio > window_ratio ){ // too narrow, width dominates
		actual_width = available_x_pixels;
		actual_height = Math.round(actual_width/(desired_ratio));
		actual_width -= actual_width%(num_cols);
		actual_height -= actual_height%(num_rows); 
	} else { // too wide, height dominates
		actual_height = available_y_pixels;
		actual_width = Math.round(actual_height*(desired_ratio));
		actual_height -= actual_height%(num_rows);
		actual_width -= actual_width%(num_cols); 
	}
	canvas.setAttribute('width', actual_width.toString()); 
	canvas.setAttribute('height', actual_height.toString());
	canvas.width = canvas.width; canvas.height = canvas.height;
	context.textAlign = "start";
	context.textBaseline = "top";
	context.lineCap = "round";
	context.lineJoin = "round";
	context.lineWidth = 3;
	let font_size_pixels = Math.round(actual_height/num_rows*0.8);
	context.font = "Bold " + font_size_pixels+"px Courier";	
	grid_to_canvas();
}

function change_font(font) {
	return;
}

gradient.generate_codes();
fit_canvas();

//-----------------------------------------------------------------------------------Motion functions
function torus_up()		{
	let temp = grid.shift(); 
	grid.push(temp);
}
function torus_down()	{
	let temp = grid.pop(); 
	grid.unshift(temp);
}
function torus_left()	{
	for (let i = 0; i < num_rows; i++) {
		let temp = grid[i].shift(); grid[i].push(temp)
	}
}

function torus_right()	{
	for (let i = 0; i < num_rows; i++) {
		let temp = grid[i].pop(); grid[i].unshift(temp)
	}
}

function mobius_up()	{
	let temp = grid.shift(); 
	grid.push(temp.reverse())
}

function mobius_down()	{
	let temp = grid.pop(); 
	grid.unshift(temp.reverse());
}

function mobius_left()	{
	let row = []; 
	for (let i = 0; i < num_rows; i++) {
		row.unshift(grid[i].shift());
	}
	for (let j = 0; j < num_rows; j++){
		grid[j].push(row[j]);
	}
}

function mobius_right()	{
	let row = []; 
	for (let i = 0; i < num_rows; i++) {
		row.unshift(grid[i].pop());
	}
	for (let j = 0; j < num_rows; j++) { 
		grid[j].unshift(row[j]);
	}
}

function transpose() { 
	if (num_rows == num_cols)
		grid =  grid[0].map((col, i) => grid.map(row => row[i]));
}
//----------------------------------------------------------------------------------Out-links

function quest()	{location.assign('./quest/quest.html');}
function princess()	{location.assign('./princess/rules.html');}
function sixteen()	{location.assign('./sixteens/sixteens.html');}
function fifteen()	{location.assign('./sixteens/fifteen.html');}
function game() 	{location.assign('./game/game.html'); }
function territory(){location.assign('./territory/page.html'); }

var file_list = {
	"about" : 
	[
	 	"Welcome to the ●Mobius Terminal●",
	 	"This is a small Unix-like command line",
	 	"with some special properties...",
	 	"Some are readily available, some are hidden,",
	 	"and some will emerge from experimentation.",	
	 	"[esc] toggles a special :phase mode:",
		":cat: the phase_mode file to learn more",
		"You might find something interesting."
	],

	"phase_mode" : 
	[
		"The [escape] key toggles PHASE MODE.",
		"In phase mode, you can SLIDE the grid.",
		"[IJKL] keys translate it along a Torus",
		"[WASD] keys translate it along a",
		"Real Projective Plane, which",
		"acts like a ●Mobius● strip in all directions.",
		"If you find things get too scrambled up,", 
		"the unscramble command may be helpful.",
		"---------------------------------------------",
		"Here you can also control the color gradient:",
		"defined by three waves: red, green, and blue.",
		"Each wave has four alterable properties:",
		"magnitude, frequency, center, and phase.",
		"By default, all color centers are set to 0,",
		"this is why the screen is black",
		"pressing [.] displays this information.",
		"To adjust a particular property level:,",
		"hold keys for the FIRST LETTERS",
		"of the property you want to change,",
		"and adjust with the [↓] or [↑] arrow keys.",
		"ex: holding [b] with [c] and pressing [↑]",
		"raises the blue center: see it grow blue.",
		"holding [b] with [m] and pressing [↑]",
		"raises the blue magnitude: blue fluctuates.",
		"Altering all the waves produces gradients.",
		"Some can be quite beautiful, and they become",
		"even more interesting when scrambled",
		"Experiment with it and see. Press [esc]",
		"[=] resets colors, [h] hides text."
	]
};
