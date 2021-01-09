

function findLineByLeastSquares(values_x, values_y) {
    let x_sum = 0;
    let y_sum = 0;
    let xy_sum = 0;
    let xx_sum = 0;
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
        xy_sum += x*y;
        count++;
    }

    let m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    let b = (y_sum/count) - (m*x_sum)/count;

    let result_values_x = [];
    let result_values_y = [];

    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [m, b, result_values_x, result_values_y];
}


function ideal_line(m , b){
	return 0;
}

var canvas = document.querySelector('#canvas');
canvas.width = 1200;
canvas.height = 600;
var context = canvas.getContext('2d');
context.fillRect(0,0,canvas.width, canvas.height);


//-------------------------------------------------------stylus drawing listeners/handlers
let drawing_mode = true;
let pen_down = false;
let bb; // bounding box, to adjust x,y coordinates within the terminal.

let drawn_points_x = []
let drawn_points_y = []

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
			drawn_points_x.push(x)
			drawn_points_y.push(y)
			context.lineTo(x,y);
			context.stroke();
			context.moveTo(x,y);
	}
}

canvas.onpointerup = () => {
		context.closePath();
		pen_down = false;
}


// next stuff prevents touch scrolling on mobile/ipad

function preventDefault(e){
    e.preventDefault();
}
document.body.addEventListener('touchmove', preventDefault, { passive: false });

context.fillStyle = "#000"
