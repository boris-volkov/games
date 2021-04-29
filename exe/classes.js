
class Class {
	constructor(start_hr, start_min){
		this.start = start_hr*60 + start_min;
		this.end = this.start + 45;
	}

	includes (mins) {
		return this.start <= mins && mins <=this.end;
	}

}

const week = { 
	1: [new Class(9,45),
		new Class(13,15),
	],
	2: [new Class(11,25),
		new Class(13,15),
	],
	3: [new Class(8,40),
		new Class(9,40),
		new Class(13,15),
		new Class(14,10)
	],
	4: [new Class(8,45),
		new Class(9,40),
		new Class(10,35),
		new Class(13,5),
		new Class(14,15)
	],
	5: [new Class(8,40),
		new Class(9,45),
		new Class(13,5),
		new Class(14,10),
	]
}

function refresh(){ 
	let now = new Date();
	//console.log(now.toString());
	weekday = now.getDay();
	hour = now.getHours();
	minute = now.getMinutes();
	day_minute = hour*60 + minute;
	today = week[weekday];

	for (let i = 0; i < today.length; i++){
		if (day_minute < today[i].start){
			let mins_left = today[i].start - day_minute;
			if (mins_left > 60){
				let hrs_left = Math.floor(mins_left/60);
				mins_left = mins_left%60;
				console.log("class in ", hrs_left, "hours", mins_left,"minutes");
				return;
			}
			console.log("class in", mins_left, "minutes");
			return;
		}
		if (today[i].includes(day_minute)) {
			mins_left = today[i].end - day_minute;
			console.log(mins_left, "minutes left of class");
			return;
		}
	}

	if (weekday === 5){
		console.log("Next class Monday at 9:45")
		return;
	}

	console.log("Next class tomorrow at", 
		Math.floor(week[(weekday+1)][0].start/60),
		":",
		week[(weekday+1)][0].start%60
	)
	return;
}

refresh();
let id = setInterval( refresh, 1000*60);
