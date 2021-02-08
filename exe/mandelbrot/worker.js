onmessage = function(message) {
	const {tile, x0, y0, perPixel, maxIterations} = message.data;
	const {width, height} = tile;

	const imageData = new ImageData(width, height);
	const iterations = new Uint32Array(imageData.data.buffer);
	// typed array treats each pixel as a single integer instead of 
	// 4 separate bytes. These will be mapped to colors in parent thread

	let index = 0; // to go pixel by pixel in the iterations array
	let max = 0; 
	let min = maxIterations;
	// stepping throught the image and the graph in same loop.
	// row and col are the pixel coordinates
	// x and y are the actual complex number
	for (let row = 0, y = y0; row < height ;row++, y+= perPixel){
		for (let col = 0, x = x0; col < width; col++, x += perPixel) {
			let n;
			let r = x, i = y; // real and imaginary
			// inner loop iterates over each pixel to see if it escapes
			for (n = 0; n < maxIterations; n++){
				let rr = r*r, ii = i*i;
				if (rr + ii > 8){
					break;
				}
				i = 2*r*i + y;
				r = rr - ii + x;
			}
			iterations[index++] = n; // remember # iterations per pixel
			if (n > max) max = n;
			if (n < min) min = n;
		}
	}
	postMessage({tile, imageData, min, max}, [imageData.data.buffer]);
}
