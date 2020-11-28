
const platform1 = {
	w: 300,
	h: 40,
	x: 0,
	y: 400,
	dx : 1,
}

const platform2 = {
	w: 600,
	h: 40,
	x: 0,
	y: 500,
	dx : 3,
}

const platform3 = {
	w: 300,
	h: 40,
	x: 0,
	y: 300,
	dx : 2,
}

const platform4 = {
	w: 100,
	h: 40,
	x:0,
	y : 100,
	dx : 4,
}

const platform5 = {
	w: 200,
	h: 40,
	x: 0,
	y : 200,
	dx : 6,
}

const floor = {
	w : canvas.width,
	h : 40,
	x : 0,
	y : canvas.height,
	dx : 0,
}

const platforms = [platform1, platform2, platform3, platform4, platform5, floor];

let engaged_platform = undefined;

function move_platform() {
	platforms.forEach(platform => {
		platform.x += platform.dx;
	});
}

function draw_platform() {
	platforms.forEach( platform => {
		if (platform === engaged_platform){
		 	ctx.fillStyle = '#aab';
		} else {
			ctx.fillStyle = '#556';
		}
		ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
	});
	reset_background_fill();;
}


