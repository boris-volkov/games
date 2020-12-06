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
	friction 	: 0.5		,
	max_dx		: 0			,
	max_dy		: 0			,
};

// need this because javascript % is 
// wierd with negative numbers
Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
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
	player.max_dx = Math.max(player.max_dx, Math.abs(player.dx));
	player.max_dy = Math.max(player.max_dy, player.dy);
}

function new_pos() { 	
	if (player.on){
		player.y = player.on.y - player.h;
	}
	
	player.x += Math.round(player.dx)
	player.y += Math.round(player.dy)

	player.x = player.x.mod(canvas.width);
	player.y = player.y.mod(canvas.height);

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
			player.ddx = -1;
			//image = left;
			break;
		case 'd':
			player.ddx = 1;
			//image = right;
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
