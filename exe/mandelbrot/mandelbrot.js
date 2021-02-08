
class Tile {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	static *tiles(width, height, numRows, numCols) {
		let columnWidth = Math.ceil(width/numCols);
		let rowHeight = Math.ceil(height/numRows);

		for (let row = 0; row < numRows; row++) {
			let tileHeight = (row < numRows-1)
				? rowHeight
				:height - rowHeight * (numRows-1);
			for (let col = 0; col < numCols; col++) {
				let tileWidth = (col < numCols-1)
					? columnWidth
					: width - columnWidth * (numCols-1);
				yield new Tile(col*columnWidth, row*rowHeight,
					tileWidth, tileHeight);
			}
		}
	}
}

class WorkerPool {
	constructor(numWorkers, workerSource) {
		this.idleWorkers = [];
		this.workQueue = [];
		this.workerMap = new Map(); // map workers to res/rej

		for (let i = 0; i < numWorkers; i++) {
			let worker = new Worker(workerSource);
			worker.onmessage = message => {
				this._workerDone(worker, null, message.data);
			};
			worker.onerror = error => {
				this._workerDone(worker, error, null);
			};
			this.idleWorkers[i] = worker;
		}
	}

	// internal method called when a worker finishes
	_workerDone(worker, error, response) {
		let [resolver, rejector] = this.workerMap.get(worker);
		this.workerMap.delete(worker);
		// if there is no work to do, put idle
		// otherwise assign work
		if (this.workQueue.length === 0) {
			this.idleWorkers.push(worker);
		} else {
			let [work, resolver, rejector] = this.workQueue.shift()
			this.workerMap.set(worker, [resolver, rejector]);
			worker.postMessage(work);
		}
		error === null ? resolver(response) : rejector(error);
	}

	addWork(work) {
		return new Promise( (resolve, reject) => {
			if (this.idleWorkers.length > 0) {
				let worker = this.idleWorkers.pop();
				this.workerMap.set(worker, [resolve, reject]);
				worker.postMessage(work);
			} else {
				this.workQueue.push([work, resolve, reject]);
			}
		});
	}
}

class PageState {
	static initializeState() {
		let s = new PageState();
		s.cx = -0.5;
		s.cy = 0;
		s.perPixel = 3/window.innerHeight*2;
		s.maxIterations = 500;
		return s;
	}

	static fromURL(url) {
		let s = new PageState();
		let u = new URL(url);
		s.cx = parseFloat(u.searchParams.get("cx"));
		s.cy = parseFloat(u.searchParams.get("cy"));
		s.perPixel = parseFloat(u.searchParams.get("pp"));
		s.maxIterations = parseInt(u.searchParams.get("it"));
		return (isNaN(s.cx)) || (isNaN(s.cy)) || (isNaN(s.perPixel))
			|| (isNaN(s.maxIterations))
			? null
			: s;
		
	}

	toURL() {
		let u = new URL(window.location);
		u.searchParams.set("cx", this.cx);
		u.searchParams.set("cy", this.cy);
		u.searchParams.set("pp", this.perPixel);
		u.searchParams.set("it", this.maxIterations);
		return u.href;
	}
}


// these control the parallelism
const ROWS = 3;
const COLS = 4;
const NUMWORKERS = navigator.hardwareConcurrency || 2;

// initialization (used to be constructor)
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
let workerPool = new WorkerPool(NUMWORKERS, "worker.js");

let tiles = null;
let pendingRender = null;
let wantsRerender = false;
let resizeTimer = null;
let colorTable = null;
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("keydown", e => handleKey(e));
window.addEventListener("resize", e => handleResize(e));
window.addEventListener("popstate", e => setState( e.state, false));

let state = PageState.fromURL(window.location) || PageState.initializeState();
console.log(state);
history.replaceState(state, "", state.toURL()); // probably don't want this

function setSize(){
	width = canvas.width;
	height = canvas.height;
	tiles = [...Tile.tiles(width, height, ROWS, COLS)]
	console.log("tiles", tiles)
}



function setState(f, save=true) {
	if (typeof f === "function") {
		f(state);
	} else {
		for(let property in f) {
			state[property] = f[property];
		}
	}

	render();

	if (save) {
		history.pushState(state, "", state.toURL());
	}
}

function color(iterations) {
	let alpha = 255;
	let blue   = Math.round(75*Math.sin(iterations**0.4  + 2*Math.PI/3) + 175)
	let green  = Math.round(75*Math.sin(iterations**0.4  - 2*Math.PI/3) + 75)
	let red    = Math.round(-125*Math.sin(iterations**0.4   ) + 125)
	//scale values to 0-255 range and return like this:
	return ((alpha<<24) + (blue<<16) + (green<<8) + (red));
}

function render(){
	console.log(workerPool);
	if (pendingRender) {
		wantsRerender = true;
		return;
	}

	let {cx, cy, perPixel, maxIterations} = state;
	let x0 = cx - perPixel*width/2;
	let y0 = cy - perPixel*height/2;

	let promises = tiles.map( tile => workerPool.addWork({
		tile: tile,
		x0: x0 + tile.x * perPixel,
		y0: y0 + tile.y * perPixel,
		perPixel: perPixel,
		maxIterations: maxIterations
	}));

	pendingRender = Promise.all(promises).then(responses => {
		let min = maxIterations;
		let max = 0;
		for (let r of responses) {
			if (r.min < min) min = r.min;
			if (r.max > max) max = r.max;
		}

		// every iteration count from 0-maxIterations has its own color
		if (!colorTable || colorTable.length !== maxIterations+1){
			colorTable = new Uint32Array(maxIterations+1);
		}
		if (min === max) { // 
			if (min === maxIterations) {
				colorTable[min] = 0xFF000000;
			} else {
				colorTable[min] = 0xFF000000;
			}
		} else { //TODO change this! transparency is slow and it looks bad too
			for (let i = min; i < max; i++) {
				colorTable[i] = color(i);
			}
		}
		

		for (let r of responses) {
			let iterations = new Uint32Array(r.imageData.data.buffer);
			for (let i= 0; i < iterations.length; i++) {
				iterations[i] = colorTable[iterations[i]];
			}
		}
		canvas.style.transform = "";
		for (let r of responses) {
			context.putImageData(r.imageData, r.tile.x, r.tile.y);
		}
	})
	.catch((reason) => {
		console.error("promise rejected in render():", reason);
	})
	.finally(() => {
		pendingRender = null;
		if (wantsRerender) {
			wantsRerender = false;
			render();
		}
	});
}

function handleResize(event) {
	if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
		resizeTimer = null;
		setSize();
		render();
	}, 10);
}

function handleKey(event) {
	switch (event.key) {
		case "Escape":
			reset();
			break;
		case "+":
			iter_up();
			break;
		case "-":
			iter_down();
			break;
		case "o":
			out();
			break;
		case "ArrowUp":
			event.preventDefault();
			up();
			break;
		case "ArrowDown":
			event.preventDefault();
			down();
			break;
		case "ArrowLeft":
			left();
			break;
		case "ArrowRight":
			right();
			break;
	}
}

const reset_button = document.querySelector("#reset");
function reset() {
	setState(PageState.initializeState());
}
reset_button.onclick = reset;

const iter_down_button = document.querySelector("#minus");
const iter_up_button = document.querySelector("#plus");

function iter_down() {
	setState(s => {
		s.maxIterations = Math.round(s.maxIterations/1.5);
		if( s.maxIterations < 1) s.maxIterations = 1;
	});
}
iter_down_button.onclick = iter_down;

function iter_up() {
	setState(s => {
		s.maxIterations = Math.round(s.maxIterations *1.5);
	});
}
iter_up_button.onclick = iter_up;


const up_button = document.querySelector("#up");
const down_button = document.querySelector("#down");
const left_button = document.querySelector("#left");
const right_button = document.querySelector("#right");
const out_button = document.querySelector("#out");

function up(){	
	setState(s => s.cy -= height/10 * s.perPixel);
}
up_button.onclick = up;

function down() {
	setState(s => s.cy += height/10 * s.perPixel);
}
down_button.onclick = down;

function left() {
	setState(s => s.cx -= width/10 * s.perPixel);
}
left_button.onclick = left;

function right() {
	setState(s => s.cx += width/10 * s.perPixel);
}
right_button.onclick = right;

function out() {
	setState(s => s.perPixel *= 2);
}
out_button.onclick = out;

canvas.addEventListener("pointerup", event => {
	bb = canvas.getBoundingClientRect(); 
	let x0 = (event.clientX-bb.left)*(canvas.width/bb.width);
	let y0 = (event.clientY-bb.top)*(canvas.height/bb.height);
	t0 = Date.now();

	let {cx, cy, perPixel} = state;

	let cdx = x0 - width/2;
	let cdy = y0 - height/2;

	canvas.style.transform = 'translate(${-cdx*2}px, ${-cdy*2}px) scale(2)';

	setState(s => {
		s.cx += cdx*s.perPixel;
		s.cy += cdy*s.perPixel;
		s.perPixel /= 2;
	});
});

setSize();
render();
