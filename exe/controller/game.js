const canvas = document.querySelector(".canvas")
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const up = document.querySelector(".dir-up")
const left = document.querySelector(".dir-left")
const right = document.querySelector(".dir-right")
const down = document.querySelector(".dir-down")
const button = document.querySelector(".big-button")

const ctx = canvas.getContext('2d');

function preventDefault(e){
    e.preventDefault();
}
document.body.addEventListener('touchmove', preventDefault, { passive: false });

console.log('width',canvas.width);
console.log('height',canvas.height);
let x = 100;
let y = 100;

function draw_player(){
	clear();
	console.log('drawing');
	ctx.fillStyle = "#123";
	ctx.fillRect(x,y,100,100);
}

function clear() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,canvas.width, canvas.height);
}

up.addEventListener("pointerdown", (e) => {
	y-=10;
	draw_player();
});

down.addEventListener("pointerdown", (e) => {
	y+=10;
	draw_player();
});

right.addEventListener("pointerdown", (e) => {
	x+=10;
	draw_player();
});

left.addEventListener("pointerdown", (e) => {
	x-=10;
	draw_player();
});

button.addEventListener("pointerdown", (e) => {
	ctx.fillStyle = "#369";
	ctx.fillRect(x,y, 100, 100);
});
