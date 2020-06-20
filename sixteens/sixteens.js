
		

$(function  ()
{
	// Get the canvas element using the DOM
	var canvas = document.getElementById('mycanvas');
	var context = canvas.getContext('2d');
	
	const circled_nums = [0, '\u2460', '\u2461', '\u2462', '\u2463', 
			'\u2464', '\u2465', '\u2466', '\u2467', 
			'\u2468', '\u2469', '\u246a', '\u246b', 
			'\u246c', '\u246d', '\u246e', '\u246f', 
			'\u2470', '\u2471', '\u2472', '\u2473',]

	var board = 	[
				[1 ,2 ,3 ,4 ],
				[5 ,6 ,7 ,8 ],
				[9 ,10,11,12],
				[13,14,15,16]
			];

	function torus_up(){
		let temp = board.shift();
		board.push(temp);
	}

	function torus_down(){
		let temp = board.pop();
		board.unshift(temp);
	}
	
	function torus_left(){
		for (let i = 0; i < 4; i++){
			let temp = board[i].shift();
			board[i].push(temp)
		}

	}

	function torus_right(){
		for (let i = 0; i < 4; i++){
			let temp = board[i].pop();
			board[i].unshift(temp)
		}
	}

	function mobius_up(){
		let temp = board.shift();
		board.push(temp.reverse())
	}

	function mobius_down(){
		let temp = board.pop();
		board.unshift(temp.reverse());
	}

	function mobius_left(){
		let row = []
		for (let i = 0; i < 4; i++)
			row.unshift(board[i].shift());
		for (let j = 0; j < 4; j++)
			board[j].push(row[j]);
	}

	function mobius_right(){
		let row = []
		for (let i = 0; i < 4; i++)
			row.unshift(board[i].pop());
		for (let j = 0; j < 4; j++)
			board[j].unshift(row[j]);
	}
		

	const colors = ["#b13", "#136", "#69b", "#369"];
	
	function draw_canvas(){
		var width = canvas.width;
		var fourth = Math.floor(width/4);
		var eighth = Math.floor(fourth/2);
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				let x = j*fourth;
				let y = i*fourth;
				let number = board[i][j];
				let color = colors[Math.floor((number-1)/4)];
				context.fillStyle = color;
				context.fillRect(x,y,fourth,fourth);
				let text = number.toString();
				context.fillStyle = "#fff";
				context.fillText(text,x+eighth,y+eighth);
			}
		}
	}

	context.textAlign = "center";
	context.fillStyle = "#369";
	context.fillRect(25,25,50,60);
	context.strokeText("Hello World", 10, 50);
	context.fillStyle = "#963";
	context.fillRect(75,75,10,10);

	resize_canvas();

	var rect_num = 0;
	window.addEventListener('keydown', (event) => {
		const key_name = event.key;

		switch (key_name){

		case 'i':
			torus_up();
			draw_canvas();
			break;
		case 'k':
			torus_down();
			draw_canvas();
			break;
		case 'j':
			torus_left();
			draw_canvas();
			break;
		case 'l':
			torus_right();
			draw_canvas();
			break;
				
		case 'w':
			mobius_up();
			draw_canvas();
			break;
		
		case 's':
			mobius_down();
			draw_canvas();
			break;
		case 'a':
			mobius_left();
			draw_canvas();
			break;
		case 'd':
			mobius_right();
			draw_canvas();
			break;
		}

	}, false);

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

});
