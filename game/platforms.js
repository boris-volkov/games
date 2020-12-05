class Platform {
	constructor(name, w, h, x, y, dx, dy){
		this.name = name;
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}

	move() {
		if (this.x + this.w > canvas.width || this.x < 0)
			this.dx *= -1;

		this.x += this.dx;
		this.y += this.dy;
	}

	draw() {
		if (this === player.on){
		 	ctx.fillStyle = '#aab';
		} else {
			ctx.fillStyle = '#556';
		}
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = '#000';
		ctx.fillText(this.name, this.x + this.w/2, this.y + this.h/2);
	}
}

let platforms = [
	new Platform("5",50,40,0,100,4,0),
	new Platform("4",100,40,0,200,6,0),
	new Platform("3",200,40,0,300,2,0),
	new Platform("2",300,40,0,400,1,0),
	new Platform("1",600,40,0,500,3,0),
	new Platform("f",canvas.width,40,0,canvas.height,0,0),
	new Platform("c",canvas.width,40,0,-40,0,0),
	new Platform("r",40,canvas.height,canvas.width,0,0,0),
	new Platform("l",40,canvas.height,-40,0,0,0)
]


function move_platforms() {
	platforms.forEach(platform => {
		platform.move()
		platform.draw()
	});
	reset_background_fill();
}

