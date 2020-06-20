$(function  ()
{
	// Get the canvas element using the DOM
	var canvas = document.getElementById('mycanvas');
	var context = canvas.getContext('2d');
	var board = 	[
				[1 ,2 ,3 ,4 ],
				[5 ,6 ,7 ,8 ],
				[9 ,10,11,12],
				[13,14,15,16]
			];
	const colors = ["#b13", "#136", "#69b", "#369"];
	//--------------------------------------------------------------------motion functions
	function torus_up()	{let temp = board.shift(); board.push(temp);}
	function torus_down()	{let temp = board.pop(); board.unshift(temp);}
	function torus_left()	{for (let i = 0; i < 4; i++) 
				{let temp = board[i].shift(); board[i].push(temp)}}
	function torus_right()	{for (let i = 0; i < 4; i++) 
				{let temp = board[i].pop(); board[i].unshift(temp)}}
	function mobius_up()	{let temp = board.shift(); board.push(temp.reverse())}
	function mobius_down()	{let temp = board.pop(); board.unshift(temp.reverse());}
	function mobius_left()	{let row = []; for (let i = 0; i < 4; i++)
				{row.unshift(board[i].shift());}
				for (let j = 0; j < 4; j++){board[j].push(row[j]);}}
	function mobius_right()	{let row = []; for (let i = 0; i < 4; i++)
				{row.unshift(board[i].pop());}
				for (let j = 0; j < 4; j++){board[j].unshift(row[j]);}}
	//------------------------------------------------------------------------------------	
	function draw_canvas(){
		var width = canvas.width;
		var fourth = Math.floor(width/4);
		var eighth = Math.floor(fourth/2);
		for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			let x = j * fourth;
			let y = i * fourth;
			let number = board[i][j];
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
		draw_canvas();
	}, false); //TODO what does this false mean?
	//--------------------------------------resize event listener
	window.addEventListener("resize", resize_canvas);
	function resize_canvas(){
		var context = canvas.getContext('2d');
		let square_side = Math.min(window.innerWidth, window.innerHeight) - 30;
		square_side = square_side - square_side%4 
		canvas.setAttribute('width', square_side.toString()); // clears the canvas
		canvas.setAttribute('height',square_side.toString());
		canvas.width = canvas.width; // clears the canvas
		canvas.height = canvas.height;
		let pix = Math.floor(canvas.width/12).toString();
		context.font = pix + "px Courier New";
		context.textAlign = "center";
		draw_canvas();
	}
	//TODO event listeners for touch events!
	
	resize_canvas();
});
