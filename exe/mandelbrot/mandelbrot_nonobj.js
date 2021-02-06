
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

class MandelbrotCanvas {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.workerPool = new WorkerPool(NUMWORKERS, "worker.js");

		this.tiles = null;
		this.pendingRender = null;
		this.wantsRerender = false;
		this.resizeTimer = null;
		this.colorTable = null;

		this.upButton = document.querySelector("#up");
		this.upButton.addEventListener("click", this.up);

		this.canvas.addEventListener("pointerdown", e => this.handlePointer(e));
		window.addEventListener("keydown", e => this.handleKey(e));
		window.addEventListener("resize", e => this.handleResize(e));
		window.addEventListener("popstate", e => this.setState( e.state, false));

		this.state = 
			PageState.fromURL(window.location) || PageState.initializeState();
		history.replaceState(this.state, "", this.state.toURL());

		this.setSize();

		this.render();
	}

	setSize() {
		this.width = this.canvas.width = window.innerWidth;
		this.height = this.canvas.height = window.innerHeight;
		this.tiles = [...Tile.tiles(this.width, this.height, ROWS, COLS)]
	}

	setState(f, save=true) {
		if (typeof f === "function") {
			f(this.state);
		} else {
			for(let property in f) {
				this.state[property] = f[property];
			}
		}

		this.render();

		if (save) {
			history.pushState(this.state, "", this.state.toURL());
		}
	}

	color(iterations, maxIterations) {
		let alpha = 255;
		let blue   = Math.round(75*Math.sin(iterations**0.4   + 2*Math.PI/3) + 175)
		let green  = Math.round(75*Math.sin(iterations**0.4  - 2*Math.PI/3) + 75)
		let red    = Math.round(-125*Math.sin(iterations**0.4   ) + 125)
		//scale values to 0-255 range and return like this:
		return ((alpha<<24) + (blue<<16) + (green<<8) + (red));
	}

	render(){

		if ( this.pendingRender) {
			this.wantsRerender = true;
			return;
		}

		let {cx, cy, perPixel, maxIterations} = this.state;
		let x0 = cx - perPixel*this.width/2;
		let y0 = cy - perPixel*this.height/2;

		let promises = this.tiles.map( tile => this.workerPool.addWork({
			tile: tile,
			x0: x0 + tile.x * perPixel,
			y0: y0 + tile.y * perPixel,
			perPixel: perPixel,
			maxIterations: maxIterations
		}));

		this.pendingRender = Promise.all(promises).then(responses => {
			let min = maxIterations;
			let max = 0;
			for (let r of responses) {
				if (r.min < min) min = r.min;
				if (r.max > max) max = r.max;
			}

			// every iteration count from 0-maxIterations has its own color
			if (!this.colorTable || this.colorTable.length !== maxIterations+1){
				this.colorTable = new Uint32Array(maxIterations+1);
			}

			if (min === max) { // 
				if (min === maxIterations) {
					this.colorTable[min] = 0xFF000000;
				} else {
					this.colorTable[min] = 0xFF000000;
				}
			} else { //TODO change this! transparency is slow and it looks bad too
				let maxlog = Math.log(1+max-min);
				console.log(min, max);
				for (let i = min; i < max; i++) {
					this.colorTable[i] = this.color(i, maxIterations);
				}
			}

			for (let r of responses) {
				let iterations = new Uint32Array(r.imageData.data.buffer);
				for (let i= 0; i < iterations.length; i++) {
					iterations[i] = this.colorTable[iterations[i]];
				}
			}
			this.canvas.style.transform = "";
			for (let r of responses) {
				this.context.putImageData(r.imageData, r.tile.x, r.tile.y);
			}
		})
		.catch((reason) => {
			console.error("promise rejected in render():", reason);
		})
		.finally(() => {
			this.pendingRender = null;
			if (this.wantsRerender) {
				this.wantsRerender = false;
				this.render();
			}
		});
	}

	handleResize(event) {
		if (this.resizeTimer) clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(() => {
			this.resizeTimer = null;
			this.setSize();
			this.render();
		}, 50);
	}

	handleKey(event) {
		switch (event.key) {
			case "Escape":
				this.setState(PageState.initializeState());
				break;
			case "+":
				this.setState(s => {
					s.maxIterations = Math.round(s.maxIterations *1.5);
				});
				break;
			case "-":
				this.setState(s => {
					s.maxIterations = Math.round(s.maxIterations/1.5);
					if( s.maxIterations < 1) s.maxIterations = 1;
				});
				break;
			case "o":
				this.setState(s => s.perPixel *= 2);
				break;
			case "ArrowUp":
				event.preventDefault();
				this.up();
				break;
			case "ArrowDown":
				event.preventDefault();
				this.down();
				break;
			case "ArrowLeft":
				this.left();
				break;
			case "ArrowRight":
				this.right();
				break;
		}
	}


	up(){	
		this.setState(s => s.cy -= this.height/10 * s.perPixel);
	}

	down() {
		this.setState(s => s.cy += this.height/10 * s.perPixel);
	}

	left() {
		this.setState(s => s.cx -= this.width/10 * s.perPixel);
	}

	right() {
		this.setState(s => s.cx += this.width/10 * s.perPixel);
	}



	handlePointer(event) {
		const x0 = event.clientX, y0 = event.clientY, t0 = Date.now();
		
		const pointerMoveHandler = event => {
			let dx = event.clientX-x0;
			let dy = event.clientY-y0; 
			let dt = Date.now() - t0;
			if (dx > 10 || dy > 10 || dt > 500){
				this.canvas.style.transform = 'translate(${dx}px, ${dy}px)';
			}
		};

		const pointerUpHandler = event => {
			this.canvas.removeEventListener("pointermove", pointerMoveHandler);
			this.canvas.removeEventListener("pointerup", pointerUpHandler);

			const dx = event.clientX-x0, dy = event.clientY-y0, dt=Date.now()-t0;
			const {cx, cy, perPixel} = this.state;

			if (dy > 10 || dy > 10 || dt > 500) {
				this.setState({cx:cx - dx*perPixel, cy: cy - dy*perPixel});
			} else {
				let cdx = x0 - this.width/2;
				let cdy = y0 - this.height/2;

				this.canvas.style.transform = 
					'translate(${-cdx*2}px, ${-cdy*2}px) scale(2)';

				this.setState(s => {
					s.cx += cdx*s.perPixel;
					s.cy += cdy*s.perPixel;
					s.perPixel /= 2;
				});
			}
		};

		this.canvas.addEventListener("pointermove", pointerMoveHandler);
		this.canvas.addEventListener("pointerup", pointerUpHandler);
	}
}

let canvas = document.querySelector("#canvas");
new MandelbrotCanvas(canvas);
