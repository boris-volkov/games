const player = {
	w 			: 40  		, 
	h 			: 40 		,
	x 			: 1000 		, 
	y 			: 100		, 
	dx 			: 0   		, 
	dy 			: 0	 		,
	ddx 		: 0   		, 
	ddy 		: 1  		,
	on			: undefined	,
	jumped   	: 0			,
	friction 	: 1			,
};

function new_vel() {

	on_platform()
	
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
	
	player.x += player.dx
	player.y += player.dy
	
	player.x = Math.round(player.x);
	player.y = Math.round(player.y);
	
}

function jump() {
	if (engaged_platform && player.dy === 0) {
		player.dy -= player.jump;
		player.dx *= 0.5;
		engaged_platform = undefined;
	}
}


function draw_player() {
	ctx.drawImage(image, player.x, player.y, player.w, player.h);
}


// KEY LISTENERS

function keyDown(e) {
	switch (e.key){
		case 'w':
			if (player.on) {
				player.on = undefined;
			}
			if (player.jumped === 0){
				player.dy = -15;
				player.jumped = 1;
			}
			break;
		case 'a':
			player.ddx = -2;
			image = left;
			break;
		case 'd':
			player.ddx = 2;
			image = right;
			break;
		case 'p':
			clearInterval(interval_id);

	}
}

function keyUp(e) {
	switch (e.key){
		case 'w':
			player.jumped = 0;
			break;
		case 'a':
			player.ddx = 0;
			break;
		case 'd':
			player.ddx = 0;
			break;
	}
}

						//string: what kind of event listener
						//function: what to do when the event happens
document.addEventListener('keydown'	, keyDown);
document.addEventListener('keyup'	, keyUp);
