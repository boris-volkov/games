
	//-------------------------------------------Initialization of progress bar	
	var canvas = document.getElementById('puzzle_space');
	var context = canvas.getContext('2d');
	const urlParams = new URLSearchParams(window.location.search);
        
	function computeDecimalFull(time) {
		let elapsed = time - START_TIME;
		let part = elapsed / TIME_LIMIT;
		return Math.min(1, part);
	}
	
	let color1 = '#FFF';
	let color2 = '#255585';
	
	function progress_bar(){
		const decimalFull = computeDecimalFull(Date.now());
		const widthFull = decimalFull*canvas.width;
		context.fillStyle = color1; // ?? fix name
		context.fillRect(0,0, widthFull, canvas.height);
		context.fillStyle = color2;
		context.fillRect(widthFull, 0, canvas.width-widthFull, canvas.height);
	}

	const TIME_LIMIT = 1000 * 60 * 5;

	function isTimeOut() {
   		return START_TIME + TIME_LIMIT < Date.now();
	}

	//-------------------------------------------------------Resize Event Listener
	window.addEventListener("resize", draw_canvas);
	const PROGRESS_BAR_SCALE = 1.1;
	function draw_canvas(){ //rename to resize?
		var context = canvas.getContext('2d');
		canvas.setAttribute('width', window.innerWidth-30); 
		//canvas.setAttribute('height', window.innerHeight*PROGRESS_BAR_SCALE);//TODO
		canvas.setAttribute('height', 100);
		canvas.width = canvas.width; canvas.height = canvas.height;
		progress_bar();
	}

	//at start of playing
	
	const START_TIME = Date.now()
	setInterval(draw_canvas, 100);
