let audio_context = new (this.AudioContext || this.webkitAudioContext)();

// each note has a duration, frequency, and volume control
function play_note(freq) {
	let start_time = audio_context.currentTime;
	let stop_time = start_time + 1; // play for one second

	let o = audio_context.createOscillator();
	o.frequency.value = freq;
	o.type = "triangle"; // other options : sine, square, sawtooth, custom

	let volume_control = audio_context.createGain();
	volume_control.gain.setTargetAtTime(0.5, start_time, 0.02);
	volume_control.gain.setTargetAtTime(0, start_time + 0.1, 0.1);
						// parameters: volume (0-1), start time, speed(sort of) ->
						// -> smaller number means faster exponential ramp 

	o.connect(volume_control)  // connect oscillator to volume control
	volume_control.connect(audio_context.destination) // connect vol. control to speakers
	
	o.start(start_time); // this actually plays the note
	o.stop(stop_time);   // and you need to stop it or else it plays forever
}

// this next part is the DATA portion of the program
// to the computer, notes are just numbers, so we need to translate.

let key = 261.626/2; // one octave below middle C, change this to change key

// Just Temperament... music theory!!
// note: regular pianos use Well Temperament
// you would have to change these numbers if you want that
let tonic = 1;
let semitone = (16/15);
let whole_tone = (9/8);
let minor_third = (6/5);
let major_third = (5/4);
let fourth = (4/3);
let tritone = (7/5);
let fifth = (3/2);
let minor_sixth = (8/5);
let major_sixth = (5/3);
let minor_seventh = (9/5);
let major_seventh = (15/8);
let octave = 2;

// keep track of keys down since we don't want the note
// to spam when the key is held down
let keys_down = new Set();

document.addEventListener("keydown", (e) => {
	if (keys_down.has(e.key))
		return -1; // skip, if the key is already down
	keys_down.add(e.key);
	if (e.key === 'z') play_note(key * tonic);
	if (e.key === 's') play_note(key * semitone);
	if (e.key === 'x') play_note(key * whole_tone);
	if (e.key === 'd') play_note(key * minor_third);
	if (e.key === 'c') play_note(key * major_third);
	if (e.key === 'v') play_note(key * fourth);
	if (e.key === 'g') play_note(key * tritone);
	if (e.key === 'b') play_note(key * fifth);
	if (e.key === 'h') play_note(key * minor_sixth);
	if (e.key === 'n') play_note(key * major_sixth);
	if (e.key === 'j') play_note(key * minor_seventh);
	if (e.key === 'm') play_note(key * major_seventh);
	if (e.key === ',') play_note(key * octave);
});

document.addEventListener("keyup", (e) => {
	if (keys_down.has(e.key))
		keys_down.delete(e.key);
});
