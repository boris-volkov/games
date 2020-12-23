const GRID_SIZE = 16;

function zero_grid(size){
	let grid = Array(size);
	for (let i = 0; i < size; i++){
		grid[i] = Array(size)
		for (let j = 0; j < size; j++){
			grid[i][j] = 0;
		}
	}
	return grid;
}

const grid 			= zero_grid(16);
const backup_grid 	= zero_grid(16);

grid.locked = false;


class Cursor {
	constructor(color) {
		this.i =            
		this.j = 			
		this.color = color;
	}

	static capture(grid, color) {
		for (let i = 0; i < grid.length; i++){
			mark(grid, i, 0, color);
			mark(board, i, board[0].length - 1, color);
		}

		return 0;
	}



	count() {
		let count = 0;

		return count;
	}

	draw() {


	}
}
