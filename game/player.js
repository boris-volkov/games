const player = {
	w 			: 40		, 
	h 			: 40		,
	x 			: 1000		, 
	y 			: 100		, 
	dx			: 0			, 
	dy			: 0			,
	ddx 		: 0			, 
	ddy 		: 1			,
	on			: undefined	,
	jumped   	: 0			,
	friction 	: 0.5		,
};

let image = robot_standing;

function new_vel() {
	on_platform(player);	
	player.dx += player.ddx;
	if (player.on){ //friction
		if (player.dx > player.on.dx)
			player.dx -= player.friction;
		if (player.dx < player.on.dx)
			player.dx += player.friction;
		player.dy = player.on.dy;
	} else {
		player.dy += player.ddy;
	}
}

function new_pos() { 	
	if (player.on){
		player.y = player.on.y - player.h;
	}
	
	player.x += Math.round(player.dx);
	player.y += Math.round(player.dy);

	player.x = player.x.mod(canvas.width);
	player.y = player.y.mod(canvas.height);

}

function draw_player() {
	ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

// KEY LISTENERS
function keyDown(e) {
	switch (e.key){
		case ' ':
		case 'w':
		case 'ArrowUp':
			if (player.jumped === 0){
				player.on = undefined;
				player.dy = -15;
				player.jumped = 1;
			}
			break;
		case 'a':
		case 'ArrowLeft':
			player.ddx = -1;
			break;
		case 'd':
		case 'ArrowRight':
			player.ddx = 1;
			break;
		case 'p':
			clearInterval(interval_id);
			break;
		case 'h':
			switch (platforms){
				case platforms1:
					platforms = platforms2;
					break;
				case platforms2:
					platforms = platforms3;
					break;
				case platforms3:
					platforms = platforms1;
					break;
			}
			break;
		case '.':
			show_info ^= true;
			break;
		case '=':
			MAX_TRAIL_RADIUS += 1;
			break;
		case '-':
			MAX_TRAIL_RADIUS = Math.max(0, MAX_TRAIL_RADIUS - 1);
			break;
		case ']':
			TRAIL_LENGTH = Math.min(MAX_TRAIL_LENGTH, TRAIL_LENGTH + 1);;
			break;
		case '[':
			TRAIL_LENGTH = Math.max(0, TRAIL_LENGTH - 1);
			break;
		case 'g':
			show_sprite ^= true;
			break;

	}
}

function keyUp(e) {
	switch (e.key){
		case ' ':
		case 'w':
		case 'ArrowUp':
			player.jumped = 0;
			break;
		case 'a':
		case 'ArrowLeft':
			player.ddx = 0;
			break;
		case 'd':
		case'ArrowRight':
			player.ddx = 0;
			break;
	}
}

						//string: what kind of event listener
						//function: what to do when the event happens
document.addEventListener('keydown'	, keyDown);
document.addEventListener('keyup'	, keyUp);
