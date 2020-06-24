$(function  ()
{
	//----------------------------------------------------------------Initialization of canvas and grid
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	const urlParams = new URLSearchParams(window.location.search);
	var grid_size = parseInt( urlParams.get('size'));
	if (grid_size == undefined) { grid_size = 32; }
	var grid = Array(grid_size);
	for (let row = 0; row < grid_size; row++) {grid[row] = Array(grid_size).fill(row);}
	//--------------------------------------------------------------------------Color state and methods
	function Color(name){
		this.name = name;
		this.amp = 0;
		this.freq = 6.283/grid_size;
		this.phase = 0;
		this.center = 125;
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
	//-----------------------------------------------------------------------------------Motion functions
	function torus_up()	{let temp = grid.shift(); grid.push(temp);}
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
	function grid_to_canvas(){
		var grid_div = canvas.width/grid_size;
		for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			let x = j * grid_div;
			let y = i * grid_div;
			let color = gradient.rgb_codes[grid[i][j]];
			context.fillStyle = color;
			context.fillRect(x, y, grid_div, grid_div);
		}}
		if (display){
		font_height = Math.round(canvas.width/30);
		context.font = font_height+"px Courier New";
		context.fillStyle = '#000';
		context.fillText(gradient.red.toString(),width/2,  font_height);
		context.fillText(gradient.grn.toString(),width/2,2*font_height);
		context.fillText(gradient.blu.toString(),width/2,3*font_height);
		}
	}	

	//----------------------------------------------------------key event listener + key -> function maps
	
	var keys_down = {
	'r': false, 	'g': false,  	'b': false, 	'p': false,
	'f': false,	'm': false, 	'c': false
	};

	const key_function_map = {
	'i': torus_up,		'k': torus_down,	'j': torus_left,
	'l': torus_right,	'w': mobius_up,		's': mobius_down,
	'a': mobius_left,	'd': mobius_right,      't': transpose,
	'.': () => {display ^= true},
			
	'ArrowUp' : () => 	{if (keys_down['r']){ 
					if (keys_down['f'])
						gradient.red.freq *= 1.1;
					if (keys_down['p'])
						gradient.red.phase += 1;
					if (keys_down['m'])
						gradient.red.amp += 5;
					if (keys_down['c'])
						gradient.red.center += 5;
					}
				 if (keys_down['g']){ 
					if (keys_down['f'])
						gradient.grn.freq *= 1.1;
					if (keys_down['p'])
						gradient.grn.phase += 1;
					if (keys_down['m'])
						gradient.grn.amp += 5;
					if (keys_down['c'])
						gradient.grn.center += 5;
					}
				 if (keys_down['b']){ 
					if (keys_down['f'])
						gradient.blu.freq *= 1.1;
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
						gradient.red.freq /= 1.1;
					if (keys_down['p'])
						gradient.red.phase -= 1;
					if (keys_down['m'])
						gradient.red.amp -= 5;
					if (keys_down['c'])
						gradient.red.center -= 5;
					}
				 if (keys_down['g']){ 
					if (keys_down['f'])
						gradient.grn.freq /= 1.1;
					if (keys_down['p'])
						gradient.grn.phase -= 1;
					if (keys_down['m'])
						gradient.grn.amp -= 5;
					if (keys_down['c'])
						gradient.grn.center -= 5;
					}
				 if (keys_down['b']){ 
					if (keys_down['f'])
						gradient.blu.freq /= 1.1;
					if (keys_down['p'])
						gradient.blu.phase -= 1;
					if (keys_down['m'])
						gradient.blu.amp -= 5;
					if (keys_down['c'])
						gradient.blu.center -= 5;
					}
				}
	};

	window.addEventListener('keydown', (event) => {
		if (keys_down.hasOwnProperty(event.key)){
			keys_down[event.key] = true;
			return;
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
	function draw_canvas(){ //rename to resize?
		var context = canvas.getContext('2d');
		let square_side = Math.min(window.innerWidth, window.innerHeight) - 30;
		square_side -= square_side%(grid_size); 
		canvas.setAttribute('width', square_side.toString()); 
		canvas.setAttribute('height',square_side.toString());
		canvas.width = canvas.width; canvas.height = canvas.height;
		context.textAlign = "center";
		grid_to_canvas();
	}
	gradient.generate_codes();
	draw_canvas();
});
