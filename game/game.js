let interval_id = setInterval( () => {
	clear();
	move_platforms();
	new_vel();
	new_pos();
	draw_player();
	info();
}, 25);

function inside_x(a ,b)	{ return (((a.x + a.w) > b.x) && (a.x < (b.x + b.w)));}
function inside_y(a ,b)	{ return (((a.y + a.h) > b.y) && (a.y < (b.y + b.h)));}

function on     (a, b)	{ return (  Math.abs(a.y + a.h - b.y) <= (a.dy - b.dy)) }
function beside (a, b) 	{ return (  Math.abs(a.x + a.w - b.x) <= (a.dx - b.dx)) }

function detect_collision(a, p){
	for ( let i = 0; i < p.length; i++ ){
		if ( inside_x(a, p[i]) && on(a, p[i])){
				a.on = p[i];
		} else {
			a.on = undefined;
		}
	}
}


function on_platform(){
	for (let i = 0; i < platforms.length; i++)
	{
		if 	( player.dy >= 0 &&
		   	(on(player, platforms[i])) &&
			(inside_x(player, platforms[i])))
		{
			if (platforms[i] === player.on)
				return;
			player.on = platforms[i];
			return;
		}
	}
	// otherwise no platform was engaged
	player.on = undefined;
}

