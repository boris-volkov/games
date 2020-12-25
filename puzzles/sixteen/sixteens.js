$(function  ()
{
	// Get the canvas element using the DOM
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	var grid = 	[
				[1 ,2 ,3 ,4 ],
				[5 ,6 ,7 ,8 ],
				[9 ,10,11,12],
				[13,14,15,16]
			];
	const colors = 	["#b13", "#136", "#69b", "#369"];

	//TODO
	//transpose function!
	//array[0].map((_, colIndex) => array.map(row => row[colIndex]));

	//--------------------------------------------------------------------motion functions
	function torus_up()	{let temp = grid.shift(); grid.push(temp);}
	function torus_down()	{let temp = grid.pop(); grid.unshift(temp);}
	function torus_left()	{for (let i = 0; i < 4; i++) 
				{let temp = grid[i].shift(); grid[i].push(temp)}}
	function torus_right()	{for (let i = 0; i < 4; i++) 
				{let temp = grid[i].pop(); grid[i].unshift(temp)}}
	function mobius_up()	{let temp = grid.shift(); grid.push(temp.reverse())}
	function mobius_down()	{let temp = grid.pop(); grid.unshift(temp.reverse());}
	function mobius_left()	{let row = []; for (let i = 0; i < 4; i++)
				{row.unshift(grid[i].shift());}
				for (let j = 0; j < 4; j++){grid[j].push(row[j]);}}
	function mobius_right()	{let row = []; for (let i = 0; i < 4; i++)
				{row.unshift(grid[i].pop());}
				for (let j = 0; j < 4; j++){grid[j].unshift(row[j]);}}
	//------------------------------------------------------------------------------------	
	function grid_to_canvas(){
		var width = canvas.width;
		var fourth = width/4;
		var eighth = fourth/2;
		for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			let x = j * fourth;
			let y = i * fourth;
			let number = grid[i][j];
			let color = colors[Math.floor((number-1) / 4)];
			context.fillStyle = color;
			context.fillRect(x, y, fourth, fourth);
			let text = number.toString();
			context.fillStyle = "#fff";
			context.fillText(text ,x + eighth, y + eighth);}}
	}	
	//---------------------------------------key event listener
	const key_function_map = {	
	'i': torus_up,		'k': torus_down,	'j': torus_left,
	'l': torus_right,	'w': mobius_up,		's': mobius_down,
	'a': mobius_left,	'd': mobius_right
	}

	window.addEventListener('keydown', (event) => {
		key_function_map[event.key]();
		grid_to_canvas();
	}, false); //TODO what does this false mean?
	//--------------------------------------resize event listener
	window.addEventListener("resize", draw_canvas);
	function draw_canvas(){
		var context = canvas.getContext('2d');
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

});
