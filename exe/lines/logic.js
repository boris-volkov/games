

function findLineByLeastSquares(values_x, values_y) {
    let x_sum = 0;
    let y_sum = 0;
    let xy_sum = 0;
    let xx_sum = 0;
	let yy_sum = 0;
    let count = 0;

    let x = 0;
    let y = 0;
    let values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    if (values_length === 0) {
        return [ [], [] ];
    }

    for (let i = 0; i< values_length; i++) {
        x = values_x[i];
        y = values_y[i];
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
		yy_sum += y*y;
        xy_sum += x*y;
        count++;
    }

    let m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    let b = (y_sum/count) - (m*x_sum)/count;

	let r = 1.0;
	let n = count;
	r *= (n*xy_sum - x_sum*y_sum);
	r /= Math.sqrt( (n * xx_sum - x_sum**2) * (n*yy_sum-y_sum**2) );

    let result_values_x = [];
    let result_values_y = [];

    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [result_values_x, result_values_y, m*-1, b, r**50];
}



var canvas = document.querySelector('#canvas');
canvas.width = 1200;
canvas.height = 700;
var context = canvas.getContext('2d');
context.fillRect(0,0,canvas.width, canvas.height);
context.lineWidth=4;

let score_board = document.querySelector("#score_board");


//-------------------------------------------------------stylus drawing listeners/handlers
let pen_down = false;

let drawn_points_x = [];
let drawn_points_y = [];
let rotated_points_x = [];
let rotated_points_y = [];
let score_stack = [];

canvas.onpointerdown = (event) => {
	context.beginPath();
	pen_down = true;
	bb = canvas.getBoundingClientRect(); 
	let x = (event.clientX-bb.left)*(canvas.width/bb.width);
	let y = (event.clientY-bb.top)*(canvas.height/bb.height);
	context.moveTo(x,y);
	context.strokeStyle = "#369";
	context.fillStyle = "#369";
}

async function clear(){
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	context.fillStyle = "#000";
	context.fillRect(0,0,canvas.width, canvas.height);
	context.lineWidth=4;
}

canvas.onpointermove = (event) => {
	if (pen_down){
		let x = (event.clientX-bb.left)*(canvas.width/bb.width);
		let y = (event.clientY-bb.top)*(canvas.height/bb.height);
		if (x < 0 || x > canvas.width || y < 0 || y > canvas.height){
			finish_line();
			return;
		}
		drawn_points_x.push(x)
		drawn_points_y.push(y)
		context.lineTo(x,y);
		context.stroke();
	}
}

let total = 0;
let lines_drawn = 0;

function finish_line() {
	context.closePath();	
	let [xes, yes, m, b, r_squared] = findLineByLeastSquares(drawn_points_x, drawn_points_y);

	console.log(m);
	if (Math.abs(m) < 0.5 || Math.abs(m) > 2){
		for (let i = 0; i < drawn_points_x.length; i++){
			old_x = drawn_points_x[i];
			old_y = drawn_points_y[i];
			let rotated = rotate(old_x, old_y, Math.PI/4);
			rotated_points_x.push(rotated[0]);
			rotated_points_y.push(rotated[1]);
			[xes, yes, m, b, r_squared] = findLineByLeastSquares(rotated_points_x, rotated_points_y);
		}
		for (let i = 0; i < xes.length; i++){
			old_x = xes[i];
			old_y = yes[i];
			rotated = rotate(old_x, old_y, -Math.PI/4);
			xes[i] = rotated[0];
			yes[i] = rotated[1];
		}
	}
	if (r_squared > 0.2){
		ideal_line(xes,yes);
	}
	
	write_score(Math.round(r_squared*10000)/100);
	drawn_points_x = [];
	drawn_points_y = [];
	rotated_points_x = [];
	rotated_points_y = [];
}

canvas.onpointerup = () => {
	if (drawn_points_x)
		finish_line();
	pen_down = false;
}

function write_score(score) {
	if (score !== NaN)
		total += score;
	lines_drawn += 1;
	score_board.innerHTML = ""; 
	score_board.innerHTML = score_board.innerHTML + "last: "; 
	score_board.innerHTML = score_board.innerHTML + "<green>" + score.toString();
	score_board.innerHTML = score_board.innerHTML + " ; average: ";
	score_board.innerHTML = score_board.innerHTML + (Math.round(total/lines_drawn*100)/100).toFixed(2).toString();
	
}

function ideal_line(xes, yes){
	context.beginPath();
	context.moveTo(xes[0], yes[0])
	context.lineTo(xes[xes.length-1], yes[yes.length-1]);
	context.lineWidth=2;
	context.strokeStyle="#aa3";
	context.stroke();
	context.closePath();	
}

function rotate(x, y, angle) {
	let x_prime = Math.cos(angle)*x + Math.sin(angle)*y;
	let y_prime = -1*Math.sin(angle)*x + Math.cos(angle)*y;
	return [x_prime, y_prime];
}

function range(points) {
	let min = Infinity;
	let max = -Infinity;
	for (let i = 0; i < points.length; i++){
		min = Math.min(min, points[i]);
		max = Math.max(max, points[i]);
	}
	return Math.abs(max-min);
}

// next stuff prevents touch scrolling on mobile/ipad

function preventDefault(e){
    e.preventDefault();
}
document.body.addEventListener('touchmove', preventDefault, { passive: false });

function resize(){
	let context = canvas.getContext('2d');
	let width = Math.round(window.innerWidth*2);
	let height = Math.round(window.innerHeight*2);
	canvas.setAttribute('width', width.toString()); 
	canvas.setAttribute('height',height.toString());
	canvas.width = canvas.width; canvas.height = canvas.height;
	let font_height_pix = Math.floor(canvas.width/12).toString();
	context.font = font_height_pix + "px Courier New";
	context.textAlign = "left";
}

let button = document.querySelector("#button");
button.onclick = resize;

resize();
