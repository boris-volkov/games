const canvas = document.getElementById('game_space');
canvas.width = 1200;
canvas.height = 700;
const ctx = canvas.getContext('2d');
const right = document.getElementById('right');
const left = document.getElementById('left');
ctx.font = "Bold " + 20  +"px Courier";

let image = left;

function reset_background_fill() {
	ctx.fillStyle = "#89a";
}

reset_background_fill();

function info() {
	ctx.fillStyle = '#fff';
	ctx.fillText('x    ' + player.x,  10, 20  );
	ctx.fillText('y    ' + player.y,  10, 40  );
	ctx.fillText('dx:  ' + player.dx, 10, 60  );
	ctx.fillText('dy:  ' + player.dy, 10, 80  );
	ctx.fillText('ddx: ' + player.ddx, 10, 100);
	ctx.fillText('ddy: ' + player.ddy, 10, 120);
	ctx.fillText('on:  ' + player.standing_on, 10, 140);
	reset_background_fill();
}

function clear() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

 

