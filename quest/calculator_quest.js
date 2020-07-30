	//----------------------------------------------------------------Initialization of canvas and grid	
	//var TIME_LIMIT = parseuel(limt)
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	//const urlParams = new URLSearchParams(window.location.search);
	//var grid_size = parseInt( urlParams.get('size'));
	//if (grid_size == undefined) { grid_size = 32; }
	//var grid = Array(grid_size);
	/*
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
	//-------------------------------------------------------Progress Bar
	var display = false;

	*/
        
	function computeDecimalFull(time) {
		/*
		if( typeof START_TIME == 'undefined' || time < START_TIME) {
			return 0;
		}
		*/
		let elapsed = time - START_TIME;
		let part = elapsed / TIME_LIMIT;
		return Math.min(1, part);
	}
	//let color1 = gradient.rgb_codes[color_picker()];
	//let color2 = gradient.rgb_codes[color_picker()];
	let color1 = '#cc9922';
	let color2 = '#255585';
	
	function progress_bar(){
		const decimalFull = computeDecimalFull(Date.now());
		const widthFull = decimalFull*canvas.width;
		context.fillStyle = color1; // ?? fix name
		context.fillRect(0,0, widthFull, canvas.height);
		context.fillStyle = color2;
		context.fillRect(widthFull, 0, canvas.width-widthFull, canvas.height);
	}

	const TIME_LIMIT = 1000 * 60 * 5;

	function isTimeOut() {
   		return START_TIME + TIME_LIMIT < Date.now();
	}

	//-------------------------------------------------------Resize Event Listener
	window.addEventListener("resize", draw_canvas);
	const PROGRESS_BAR_SCALE = 1.1;
	function draw_canvas(){ //rename to resize?
		var context = canvas.getContext('2d');
		canvas.setAttribute('width', window.innerWidth-30); 
		//canvas.setAttribute('height', window.innerHeight*PROGRESS_BAR_SCALE);
		canvas.setAttribute('height', 100);
		canvas.width = canvas.width; canvas.height = canvas.height;
		//context.textAlign = "center";
		progress_bar();
	}


	// main() I guess
	//at start of playing
	var START_TIME = Date.now()
	setInterval(draw_canvas, 100);

	//play
