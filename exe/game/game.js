
let interval_id = start_animation();

function start_animation(){
	let id = setInterval( () => {
		clear();
		if (platforms === platforms1)
			move_platforms();
		new_acc();
		new_vel();
		new_pos();
		ball_vel();
		ball_pos();
		draw_ball();
		draw_trail();
		if (show_sprite)
			draw_player();
		info();
	}, 20);
	return id;
}

let show_sprite = true;

function inside_x(a ,b)	{ return (((a.x + a.w) > b.x) && (a.x < (b.x + b.w)));}
function inside_y(a ,b)	{ return (((a.y + a.h) > b.y) && (a.y < (b.y + b.h)));}

function on     (a, b)	{ return (  Math.abs(a.y + a.h - b.y) <= (a.dy - b.dy)) }
function beside (a, b) 	{ return (  Math.abs(a.x + a.w - b.x) <= (a.dx - b.dx)) }

function on_platform(me){
	for (let i = 0; i < platforms.length; i++)
	{
		if 	( me.dy >= 0 &&
		   	(on(me, platforms[i])) &&
			(inside_x(me, platforms[i])))
		{
			if (platforms[i] === me.on)
				return;
			me.on = platforms[i];
			return;
		}
	}
	// otherwise no platform was engaged
	me.on = undefined;
}

