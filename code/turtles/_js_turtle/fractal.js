const canvas = document.querySelector("#canvas");
canvas.width = 2000;
canvas.height = 2000;
const c = canvas.getContext('2d');


function fractal(length) {
	if (length <= 4)
		return;
	for (let i = 0; i < 3; i++){
		fractal(length/2)
		right(120)

		forward(100)
	}

