$(function  ()
{
	// Get the canvas element using the DOM
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	
	const urlParams = new URLSearchParams(window.location.search);
	const grid_size = parseInt( urlParams.get('size'));

	function populate_grid(n){
		let grid = [];
		let entry = 1;
		for (let row_num = 0; row_num < n; row_num++){
			let row = [];
			for (let col = 0; col < n; col++)
				row.push(entry++);
			grid.push(row);
		}
		return grid;
	}
	

	var gradient = {
		red_amp  	: 0,
		red_freq 	: 6.28/grid_size,
		red_phase	: 0,
		red_center	: 127,
		
		grn_amp  	: 0,
		grn_freq 	: 6.28/grid_size,
		grn_phase	: 0,
		grn_center	: 127,

		blu_amp  	: 0,
		blu_freq 	: 6.28/grid_size,
		blu_phase	: 0,
		blu_center	: 127,

		rgb_codes	: [],
		generate_codes  : function() {
			this.rgb_codes = [];
			for (var i = 0; i < grid_size; ++i){
				var red = Math.sin(this.red_freq*(i+this.red_phase))*this.red_amp+this.red_center;
				var grn = Math.sin(this.grn_freq*(i+this.grn_phase))*this.grn_amp+this.grn_center;
				var blu = Math.sin(this.blu_freq*(i+this.blu_phase))*this.blu_amp+this.blu_center;
				this.rgb_codes.push('rgb('+Math.round(red)+','+Math.round(grn)+','+Math.round(blu)+')');
			}
		},

		toString	: function () {
			return [['[ Red ]' , 	'Mag:', 	this.red_amp, 
						'Frq:', 	Math.round(grid_size*this.red_freq/6.28*1000)/1000, 
						'Pha:', 	this.red_phase, 
						'Cen:', 	this.red_center,].join(' '),
				['[Green]',	'Mag:', 	this.grn_amp,
						'Frq:', 	Math.round(grid_size*this.grn_freq/6.28*1000)/1000, 
						'Pha:', 	this.grn_phase,
						'Cen:',		this.grn_center,].join(' '),
				['[Blue ]',	'Mag:', 	this.blu_amp,
						'Frq:', 	Math.round(grid_size*this.blu_freq/6.28*1000)/1000, 
						'Pha:', 	this.blu_phase,
						'Cen:',		this.blu_center].join(' '),
				]

		}
	};


	//--------------------------------------------------------------------motion functions
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

	//------------------------------------------------------------------------------------	
	var display = false;
	function grid_to_canvas(){
		var width = canvas.width;
		var grid_div = width/grid_size;
		for (var i = 0; i < grid_size; i++){
		for (var j = 0; j < grid_size; j++){
			let x = j * grid_div;
			let y = i * grid_div;
			let number = grid[i][j];
			let color = gradient.rgb_codes[Math.floor((number-1) / grid_size)];
			context.fillStyle = color;
			context.fillRect(x, y, grid_div, grid_div);
		}}
		if (display){
		s = Math.round(canvas.width/30);
		context.font = s+"px Courier New";
		context.fillStyle = '#000';
		context.fillText(gradient.toString()[0],width/2,s);
		context.fillText(gradient.toString()[1],width/2,2*s);
		context.fillText(gradient.toString()[2],width/2,3*s);
		}
	}	


	//---------------------------------------key event listener
	
	var keys_down = {
		'r' :		false,
		'g' :		false,
		'b' : 		false,
		'p' : 		false,
		'f' : 		false,
		'm' :		false,
		'c' :		false
	};

	const key_function_map = {
	'i': torus_up,		'k': torus_down,	'j': torus_left,
	'l': torus_right,	'w': mobius_up,		's': mobius_down,
	'a': mobius_left,	'd': mobius_right,      't': transpose,
	'.': () => {display ^= true},
			
	'ArrowUp' : () => 	{if (keys_down['r']){ 
					if (keys_down['f'])
						gradient.red_freq *= 1.1;
					if (keys_down['p'])
						gradient.red_phase += 1;
					if (keys_down['m'])
						gradient.red_amp += 5;
					if (keys_down['c'])
						gradient.red_center += 5;
					}
				 if (keys_down['g']){ 
					if (keys_down['f'])
						gradient.grn_freq *= 1.1;
					if (keys_down['p'])
						gradient.grn_phase += 1;
					if (keys_down['m'])
						gradient.grn_amp += 5;
					if (keys_down['c'])
						gradient.grn_center += 5;
					}
				 if (keys_down['b']){ 
					if (keys_down['f'])
						gradient.blu_freq *= 1.1;
					if (keys_down['p'])
						gradient.blu_phase += 1;
					if (keys_down['m'])
						gradient.blu_amp += 5;
					if (keys_down['c'])
						gradient.blu_center += 5;
					}
				},

	'ArrowDown' : () => 	{if (keys_down['r']){ 
					if (keys_down['f'])
						gradient.red_freq /= 1.1;
					if (keys_down['p'])
						gradient.red_phase -= 1;
					if (keys_down['m'])
						gradient.red_amp -= 5;
					if (keys_down['c'])
						gradient.red_center -= 5;
					}
				 if (keys_down['g']){ 
					if (keys_down['f'])
						gradient.grn_freq /= 1.1;
					if (keys_down['p'])
						gradient.grn_phase -= 1;
					if (keys_down['m'])
						gradient.grn_amp -= 5;
					if (keys_down['c'])
						gradient.grn_center -= 5;
					}
				 if (keys_down['b']){ 
					if (keys_down['f'])
						gradient.blu_freq /= 1.1;
					if (keys_down['p'])
						gradient.blu_phase -= 1;
					if (keys_down['m'])
						gradient.blu_amp -= 5;
					if (keys_down['c'])
						gradient.blu_center -= 5;
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
		let font_height_pix = Math.floor(canvas.width/(grid_size*3)).toString();
		//context.font = font_height_pix + "px Courier New";
		context.textAlign = "center";
		grid_to_canvas();
	}
	

	if (grid_size == undefined) { grid_size = 32; }
	var grid = populate_grid(grid_size);
	gradient.generate_codes();
	draw_canvas();
});
