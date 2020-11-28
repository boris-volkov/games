const gravity = 2;
const friction = 1;
const terminal_vel = 20;

const player = {
	w: 40,
	h: 40,
	x: canvas.width - 200,
	y: 0,
	jump: 25,
	dx: 0,
	dy: 0,
	ddx: 0,
};

function update() {
	clear();
	move_platform();
	on_platform();
	detect_collisions();
	new_vel();
	new_pos();
	draw_player();
	draw_platform();
	info();
}

function on_platform(){
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
	// otherwise no platform was engaged
	engaged_platform = undefined;
}

function jump() {
	if (engaged_platform && player.dy === 0) {
		player.dy -= player.jump;
		player.dx *= 0.5;
		engaged_platform = undefined;
	}
}

function new_vel() {
	if (keys_down['w'] || keys_down['ArrowUp'])
		jump();
	if (keys_down['d'] || keys_down['ArrowRight']){
		image = right;
		player.ddx = 2;
		player.dx = Math.min(terminal_vel, player.dx + player.ddx);
	} else if (keys_down['a'] || keys_down['ArrowLeft']){
		image = left;
		player.ddx = -2
		player.dx = Math.max(-terminal_vel, player.dx + player.ddx);
	} else {
		player.ddx /= 2;
	}

	player.jump = 15 + Math.round(Math.abs(player.dx));
	

	if (engaged_platform){
		if (player.dx > engaged_platform.dx ) player.dx = Math.max(engaged_platform.dx, player.dx - friction);
		if (player.dx < engaged_platform.dx ) player.dx = Math.min(engaged_platform.dx, player.dx + friction);
	}	
}

function new_pos() {
	player.x += player.dx;
	player.y += player.dy;

	player.x = Math.round(player.x);
	player.y = Math.round(player.y);
}

function inside_x(a ,b)	{ return (((a.x + a.w) > b.x) && (a.x < (b.x + b.w)));}
function inside_y(a ,b)	{ return (((a.y + a.h) > b.y) && (a.y < (b.y + b.h)));}

function on     (a, b)	{ return (  Math.abs(a.y + a.h - b.y) <= (a.dy - b.dy)) }
function beside (a, b) 	{ return (  Math.abs(a.x + a.w - b.x) <= (a.dx - b.dx)) }


//TODO generalize the hit detection to all surfaces.
// generalize walls into platforms.
function detect_collisions() {
	
	// platform against wall
	platforms.forEach(platform => {
		if (platform.x + platform.w >= canvas.width){
			platform.dx *= -1;
		}

		if (platform.x < 0){
			platform.dx *= -1;
		}
	});

	// walls or ceiling
	for (let i = 0; i < platforms.length; i++) {
		if (inside_y(player, platforms[i]))
			if (beside(player, platforms[i]) || beside(platforms[i], player)){
				player.dx *= -0.5;
			}
		if (inside_x(player, platforms[i]))
			if (on(platforms[i], player)){
				player.dy = 0;
			}
	}	
	
	// floor or platform
	 if (engaged_platform){
		player.y = engaged_platform.y - player.h;
		player.dy = 0;
	} else {	
		player.dy += gravity;
	}

	// went totally through floor
	if (player.y + player.h > canvas.height) {
		player.y = canvas.height - player.h;
	}
}

function draw_player() {
	ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

// KEY LISTENERS

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
setInterval(update, 25);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


