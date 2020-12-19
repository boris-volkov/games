const canvas = document.querySelector('#game_space');
canvas.width = 1200;
canvas.height = 700;
const ctx = canvas.getContext('2d');
const robot_standing 	= document.getElementById('robot_standing');
const robot_flying 		= document.getElementById('robot_flying');
const caught_standing 	= document.getElementById('caught_standing');
const caught_flying 	= document.getElementById('caught_flying');
ctx.font = "Bold " + 20  +"px Courier";

// need this because javascript % is 
// wierd with negative numbers
Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
};

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

let show_info = 0;

function info() {
	if (show_info){
		ctx.fillStyle = '#000';
		ctx.fillText('====BOT=====',         10, 20  );
		ctx.fillText('   x : ' + player.x,   10, 40  );
		ctx.fillText('   y : ' + player.y,   10, 60  );
		ctx.fillText('  dx : ' + player.dx,  10, 80  );
		ctx.fillText('  dy : ' + player.dy,  10, 100 );
		ctx.fillText(' ddx : ' + player.ddx, 10, 120 );
		ctx.fillText(' ddy : ' + player.ddy, 10, 140 );
		ctx.fillText('=---BALL---=', 		 10, 160 ); 
		ctx.fillText('   x : ' + ball.x,  	 10, 180 );
		ctx.fillText('   y : ' + ball.y,  	 10, 200 );
		ctx.fillText('  dx : ' + ball.dx, 	 10, 220 );
		ctx.fillText('  dy : ' + ball.dy, 	 10, 240 );
		ctx.fillText(' ddx : ' + ball.ddx, 	 10, 260 );
		ctx.fillText(' ddy : ' + ball.ddy, 	 10, 280 );
		ctx.fillText('============',         10, 300 );
		reset_background_fill();
	}
}

function clear() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

