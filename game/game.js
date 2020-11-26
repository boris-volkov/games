const canvas = document.getElementById('game_space');
const ctx = canvas.getContext('2d');
const right = document.getElementById('right');
const left = document.getElementById('left');

let image = right;

const gravity = 2;
const friction = 1;

ctx.fillStyle = "#fff";


const platform = {
	w: 300,
	h: 40,
	x: 400,
	y: 400,
	dx : 1,
}

const player = {
	w: 50,
	h: 50,
	x: 20,
	y: 200,
	speed: 15,
	jump: 35,
	dx: 0,
	dy: 0,
};

function drawPlatform() {
	ctx.fillStyle = '#555';
	ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
}

function drawPlayer() {
	ctx.drawImage(image, player.x, player.y, player.w, player.h);
	ctx.fillStyle = '#000';
	ctx.fillText(player.dx, 10, 10);
	ctx.fillText(player.dy, 10, 40);
	ctx.fillStyle = "#fff";
}

function clear() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function newVel() {
	if (keys_down['ArrowUp'])
		move_up();
	if (keys_down['ArrowDown'])
		;
	if (keys_down['ArrowRight']){
		image = right;
		player.dx = Math.round((player.speed + 5*player.dx)/6);
		return;
	}
	if (keys_down['ArrowLeft']){
		player.dx = Math.round((-player.speed + 5*player.dx)/6);
		image = left;
	}
}

function move_platform() {
	platform.x += platform.dx;
}

function newPos() {

	detectWalls();
	newVel();

	player.x += player.dx;
	player.y += player.dy;
	
	if (player.dx > 0 && (on_floor() || on_platform()))
		player.dx = Math.max(0, player.dx - friction);
	if (player.dx < 0 && (on_floor() || on_platform()))
		player.dx = Math.min(0, player.dx + friction);

}

function on_platform(){
		   return 	(	player.dy > 0 &&
			   			(Math.abs(player.y + player.h - platform.y) < 5)
			  			&& ((player.x < platform.x + platform.w) 
								&& (player.x + player.w > platform.x))
		   			)
}

function on_floor() {
	return (player.y + player.h >= canvas.height);
}

function detectWalls() {
	// Left wall
	if (player.x < 0) {
		player.x = 0;
	}

	// Right Wall
	if (player.x + player.w > canvas.width) {
		player.x = canvas.width - player.w;
	}

	// Top wall
	if (player.y < 0) {
		player.y = 0;
	}

	if (on_platform()) {
		player.y = platform.y - player.h;
		player.dy = 0;
		player.dx = platform.dx;
	}

	// Bottom Wall
	if (on_floor()) {
		player.y = canvas.height - player.h;
		player.dy = 0;
	} else {
		player.dy += gravity;
	}

	if (platform.x + platform.w >= canvas.width){
		platform.dx *= -1;
	}

	if (platform.x < 0){
		platform.dx *= -1;
	}


}

function update() {
	clear();
	newPos();
	move_platform();
	drawPlatform();
	drawPlayer();

	requestAnimationFrame(update);
}


function move_up() {
	if (on_floor() || on_platform()) {
		player.dy -= player.jump;
	}
}


function keyDown(e) {
	if (keys_down.hasOwnProperty(e.key))
		keys_down[e.key] = true;
	
}

function keyUp(e) {
	if (keys_down.hasOwnProperty(e.key))
		keys_down[e.key] = false;
}

const keys_down = {
	'ArrowRight' : false,
	'ArrowLeft'  : false,
	'ArrowUp'    : false,
	'ArrowDown'  : false,
}

update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


