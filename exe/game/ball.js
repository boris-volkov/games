const PI = 3.1415926535;

const ball = {
	r: 8,
	w: 8,
	h: 8,
	x: player.x,
	y: player.y,
	dx: player.dx,
	dy: player.dy,
	ddx: player.ddx,
	ddy: player.ddy,
	caught : 1,
	on: undefined,
	friction: 0.1,
	max_vel: Infinity,
}


function follow_player(){
	ball.x = player.x + 21;
	ball.y = player.y - 6;
	ball.dx = player.dx;
	ball.dy = player.dy;
}

follow_player();


let MAX_TRAIL_RADIUS = ball.r * 8;
let TRAIL_LENGTH = 8;
const MAX_TRAIL_LENGTH = 500;
ball_trail = [];

canvas.onpointerdown = (event) => {
	if (ball.caught === 1){
		bb = canvas.getBoundingClientRect();
		let x = (event.clientX-bb.left)*(canvas.width/bb.width);
		let y = (event.clientY-bb.top)*(canvas.height/bb.height);
		x += 10;
		y += 10;
		ball.dx = Math.round((x - ball.x)/10) + player.dx;
		ball.dy = Math.round((y - ball.y)/10) + player.dy;;
		while (inside_x(ball, player) && inside_y(ball, player)){
			ball.x += ball.dx;
			ball.y += ball.dy;
		}
		ball.caught = 0;
		image = robot_standing;
	}
};

function ball_vel() {
	if (inside_x(ball, player) && inside_y(ball, player)){
		ball.caught = 1;
		image = caught_standing;
	}

	if (ball.caught)
		return;

	on_platform(ball);
	
	ball.dx += ball.ddx;
	
	if (ball.on){ //friction
		if (ball.dx > ball.on.dx)
			ball.dx -= ball.friction;
		if (ball.dx < ball.on.dx)
			ball.dx += ball.friction;
		if (Math.abs(ball.dy) < 5){
			ball.dy = 0;
		} else { 
			ball.dy *= -0.8;
		}
			
	} else {
		ball.dy += ball.ddy;
	}
}

function correct_vel(){

	if (ball.dx > ball.max_vel){
		ball.dx = ball.max_vel;
	}
	if (ball.dx < -ball.max_vel){
		ball.dx = -ball.max_vel;
	}
	if (ball.dy > ball.max_vel){
		ball.dy = ball.max_vel;
	}
	if (ball.dy < -ball.max_vel){
		ball.dy = -ball.max_vel;
	}
	ball.dx = Math.round(ball.dx);
	ball.dy = Math.round(ball.dy);
}

function ball_pos(){
	if (ball.on) {
		ball.y = ball.on.y - ball.r;
	}
	if (ball.caught){
		follow_player();
		return;
	} else {
		touching_wall();
		correct_vel();
		ball.x += ball.dx;
		ball.y += ball.dy;
	}
}


function draw_trail(){
	while (ball_trail.length > TRAIL_LENGTH){
		ball_trail.shift();
	}
	ball_trail.push([ball.x, ball.y]);
	for (let i = 0; i < ball_trail.length; i++){
		//let float_amount = Math.round((ball_trail.length - i)/2);
		let float_amount = 0;
		ctx.globalAlpha = i/(ball_trail.length)/3;
		draw_ball(ball_trail[i][0], ball_trail[i][1] - float_amount, 
			(MAX_TRAIL_RADIUS) - ((MAX_TRAIL_RADIUS - ball.r)/ball_trail.length)*i);
	}
	ctx.globalAlpha = 1;
}

function draw_ball(x = ball.x, y = ball.y, r = ball.r){
	let mem = ctx.fillStyle;
	ctx.fillStyle = "#ADE";
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*PI, false);
	ctx.fill();
	ctx.fillStyle = "#336699";
	ctx.beginPath();
	ctx.arc(x, y, 2*r/3, 0, 2*PI, false);
	ctx.fill();
	ctx.fillStyle = mem;
}


function touching_wall(){
	//console.log("collision check");
	if (ball.x + 2*ball.r > canvas.width){	
		ball.x = canvas.width - 2*ball.r;
		ball.dx *= -0.8;
	}
	if	(ball.x < 0){
		ball.x = 0 ;
		ball.dx *= -0.8
	}

	if (ball.y + 2*ball.r > canvas.height){
		ball.y = canvas.height - 2*ball.r;
		ball.dy *= -0.8;
	}
	if (ball.y < 0){
		ball.y = 0;
		ball.dy *= -0.8;
	}
}

