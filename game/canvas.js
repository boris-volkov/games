const canvas = document.getElementById('game_space');
canvas.width = 1200;
canvas.height = 700;
const ctx = canvas.getContext('2d');
const robot_standing 	= document.getElementById('robot_standing');
const robot_flying 		= document.getElementById('robot_flying');
const caught_standing 	= document.getElementById('caught_standing');
const caught_flying 	= document.getElementById('caught_flying');
ctx.font = "Bold " + 20  +"px Courier";

window.oncontextmenu = function () {
  return false;
}


let animations = 
[
	[caught_flying, caught_standing ],
	[robot_flying, robot_standing ]
]

function reset_background_fill() {
	//ctx.fillStyle = "#89a";
	ctx.fillStyle = "#789";
}

reset_background_fill();

function info() {
	ctx.fillStyle = '#fff';
	ctx.fillText('  x : ' + player.x,  10, 20  );
	ctx.fillText('  y : ' + player.y,  10, 40  );
	ctx.fillText(' dx : ' + player.dx, 10, 60  );
	ctx.fillText(' dy : ' + player.dy, 10, 80  );
	ctx.fillText('ddx : ' + player.ddx, 10, 100);
	ctx.fillText('ddy : ' + player.ddy, 10, 120);
	ctx.fillText('-----', 				10, 140); 
	ctx.fillText('  x : ' + ball.x,  10, 160  );
	ctx.fillText('  y : ' + ball.y,  10, 180 );
	ctx.fillText(' dx : ' + ball.dx, 10, 200  );
	ctx.fillText(' dy : ' + ball.dy, 10, 220  );
	ctx.fillText('ddx : ' + ball.ddx, 10, 240);
	ctx.fillText('ddy : ' + ball.ddy, 10, 260);
	ctx.fillText('on  : ' + ball.on,  10, 280);
	ctx.fillText('cgt : ' + ball.caught, 10, 300);
	ctx.fillText('-----', 				10, 140);
	reset_background_fill();
}

function clear() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

