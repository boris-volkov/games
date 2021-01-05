	//----------------------------------------------------------------Initialization of canvas and grid
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	const urlParams = new URLSearchParams(window.location.search);
	var grid_size = parseInt( urlParams.get('size'));
	grid_size = 1;
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
			return [ this.name   ,' : ' , this.center].join(' ');
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
	var display = true;
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
			let font_height = Math.round(canvas.width/30);
			context.font = font_height+"px Courier New";
			context.fillStyle = '#000';
			context.fillText(gradient.red.toString(), canvas.width/2,   font_height);
			context.fillText(gradient.grn.toString(), canvas.width/2, 2*font_height);
			context.fillText(gradient.blu.toString(), canvas.width/2, 3*font_height);
		}
	}	

	//----------------------------------------------------------key event listener & key -> function maps
	
	var keys_down = {
	'r': false, 	'g': false,  	'b': false
	};

	const key_function_map = {
		'.': () => { display ^= true }, 
		'`': () => { alert(gradient.rgb_codes); },
				
		'ArrowUp' : () => 	{
			if (keys_down['r'])gradient.red.center += 1;
			if (keys_down['g'])gradient.grn.center += 1;
			if (keys_down['b'])gradient.blu.center += 1;
		},

		'ArrowDown' : () => {
			if (keys_down['r'])gradient.red.center -= 1;
			if (keys_down['g'])gradient.grn.center -= 1;
			if (keys_down['b'])gradient.blu.center -= 1;
		}
	};

	window.addEventListener('keydown', (event) => {
		if (keys_down.hasOwnProperty(event.key)){
			keys_down[event.key] = true;
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
