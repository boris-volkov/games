const canvas = document.getElementById('game_space');
canvas.width = 1200;
canvas.height = 700;
const ctx = canvas.getContext('2d');
const right = document.getElementById('right');
const left = document.getElementById('left');


ctx.font = "Bold " + 20  +"px Courier";


let image = left;

const gravity = 2;
const friction = 0.5;


function reset_background_fill() {
	ctx.fillStyle = "#89a";
}
reset_background_fill();

const player = {
	w: 40,
	h: 60,
	x: canvas.width - 200,
	y: 0,
	jump: 25,
	dx: 0,
	dy: 0,
	ddx: 0,
	falling() { return this.dx > 0 }
};


const platform1 = {
	w: 300,
	h: 40,
	x: 0,
	y: 400,
	dx : 1,
}

const platform2 = {
	w: 600,
	h: 40,
	x: 0,
	y: 500,
	dx : 3,
}

const platform3 = {
	w: 300,
	h: 40,
	x: 0,
	y: 300,
	dx : 2,
}

const platform4 = {
	w: 100,
	h: 40,
	x:0,
	y : 100,
	dx : 4,
}

const platform5 = {
	w: 200,
	h: 40,
	x: 0,
	y : 200,
	dx : 6,
}

const floor = {
	w : canvas.width,
	h : 40,
	x : 0,
	y : canvas.height,
	dx : 0,
}

const platforms = [platform1, platform2, platform3, platform4, platform5, floor];
let engaged_platform = undefined;
function drawPlatform() {
	platforms.forEach( platform => {
		if (platform === engaged_platform){
		 	ctx.fillStyle = '#aab';
		} else {
			ctx.fillStyle = '#556';
		}
		ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
	});
	reset_background_fill();;
}

function info() {
	ctx.fillStyle = '#fff';
	ctx.fillText('x    ' + player.x,  10, 20);
	ctx.fillText('y    ' + player.y,  10, 40);
	ctx.fillText('dx:  ' + player.dx, 10, 60);
	ctx.fillText('dy:  ' + player.dy, 10, 80);
	ctx.fillText('ddx: ' + player.ddx, 10, 100);
	reset_background_fill();;
}

function drawPlayer() {
	ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

function clear() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function newVel() {
	if (keys_down['d'] || keys_down['ArrowRight']){
		image = right;
		player.ddx = 1;
		player.dx += player.ddx
	} else if (keys_down['a'] || keys_down['ArrowLeft']){
		image = left;
		player.ddx = -1
		player.dx += player.ddx;
	} else {
		player.ddx = 0;
		player.jump = 15;
	}

	player.jump = 10 + Math.abs(player.dx);
	
	if (keys_down['w'] || keys_down['ArrowUp'])
		move_up();

	/*
	if (keys_down['s']){
		if (engaged_platform)
			engaged_platform.dx *= -1;
	}
	*/

	if (engaged_platform){
		if (player.dx > engaged_platform.dx ) player.dx = Math.max(engaged_platform.dx, player.dx - friction);
		if (player.dx < engaged_platform.dx ) player.dx = Math.min(engaged_platform.dx, player.dx + friction);
	}

	
}

function move_platform() {
	platforms.forEach(platform => {
		platform.x += platform.dx;
	});
}

function newPos() {

	player.x += player.dx;
	player.y += player.dy;

	player.x = Math.round(player.x);
	player.y = Math.round(player.y);

	detectWalls();
}


// is a inside the x bounds of b?
function inside_x(a , b){
	return ( ((a.x + a.w) > b.x) && (a.x < (b.x + b.w)) ); 
}


// is a reasonably close to the top surface of b?
function on(a, b){
	return (  Math.abs(a.y + a.h - b.y) < 20 ) 
}



// TODO most broken function so far.
function on_platform(){

	//if (player.dy === 0 && engaged_platform)
	//	return;

	for (let i = 0; i < platforms.length; i++) 
	{
		if 	( player.dy >= 0 &&
		   	(on(player, platforms[i])) && 
			(inside_x(player, platforms[i])))
		{
			if (platforms[i] === engaged_platform)
				return;
			engaged_platform = platforms[i];
			return;
		}
	} 
	engaged_platform = undefined;
}

function on_floor() {
	return (player.y + player.h >= canvas.height);
}

function detectWalls() {
	// Left wall
	if (player.x < 0) {
		player.x = 0;
		player.dx *= -0.5;
	}

	// Right Wall
	if (player.x + player.w > canvas.width) {
		player.x = canvas.width - player.w;
		player.dx *= -0.5;
	}

	// Top wall
	if (player.y < 0) {
		player.y = 0;
		player.dy = 0;
	}

	// floor or platform
	 if (engaged_platform){
		player.y = engaged_platform.y - player.h;
		player.dy = 0;
	} else {	
		player.dy += gravity;
	}

	if (player.y + player.h > canvas.height) {
		player.y = canvas.height - player.h;
	}

	// platform against wall
	platforms.forEach(platform => {
		if (platform.x + platform.w >= canvas.width){
			platform.dx *= -1;
		}

		if (platform.x < 0){
			platform.dx *= -1;
		}
	});
}

function move_up() {
	if ((on_floor() || engaged_platform) && player.dy === 0) {
		player.dy -= player.jump;
		engaged_platform = undefined;
	}
}

function keyDown(e) {
	if (keys_down.hasOwnProperty(e.key))
		keys_down[e.key] = true;

	if (e.key == 's' || e.key == 'ArrowDown')
		if (engaged_platform)
			engaged_platform.dx *= -1;
	
}

function keyUp(e) {
	if (keys_down.hasOwnProperty(e.key)){
		keys_down[e.key] = false;
		player.ddx = 0;
	}
}

const keys_down = {
	'd' : false,
	'a'  : false,
	's'    : false,
	'w'  : false,
	'ArrowRight' : false,
	'ArrowLeft' : false,
	'ArrowUp' : false,
	'ArrowDown' : false,
}

function update() {
	clear();
	move_platform();
	on_platform();
	newVel();
	newPos();
	drawPlayer();
	drawPlatform();
	info();
}

setInterval(update, 25);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


