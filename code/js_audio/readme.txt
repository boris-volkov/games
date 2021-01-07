Here is a program that demonstrates how to create audio in javascript. You can try it 101010a href="./main.html"111000 here 101010/a111000 (you will need a keyboard).

All the html file does is bring in the javascript file. There can be more content there of course, but this is the minimum that is required. 

The javascript program takes the bottom two rows of the keyboard and uses "keydown" event-listeners turns them into the 12 standard notes arranged like on a piano. Like this:

	  [s][d]   [g][h][j]
	[z][x][c][v][b][n][m][,]

(take a look at a piano if you're confused!)

What's happening in this program:

First we retrieve the "audio context" from the html document, (This is similar to how you get the context in a html canvas program), and name it something creative like "audio_context"

To play, every note needs an OSCILLATOR which determines frequency and wavetype. Frequency is the note (i.e. 261.626 hz is middle C). Wavetype determines how smooth or rough the sound is. The default sine wave is smooth, while the triangle wave is well.. triangluar and the square wave is... just listen to them and see. You can also create your own custom waveform if you really want a unique sound (be prepared to do some math!).

Each note also needs a VOLUME CONTROL which lets you gradually ramp up to full volume and fade out, or whatever you like. The volume control is not stricly required, but it sounds much better than just playing the note at full volume the whole time. (try it without volume control, you'll see).

Then, connections are made oscillator -> volume control -> speakers, and the note is ready to play.

	oscillator.start();  starts the note
	oscillator.stop();   stops it.

these functions take a time value as a parameter. The audio context conveniently keeps track of the current time in the variable "audio_context.currentTime", therefore: 

	start_time = audio_context.currentTime;
	stop_time = audio_context.currentTime + 1.5;
	oscillator.start(start_time);
	oscillator.stop(stop_time);

for example, will play the note for 1.5 seconds.

Study this program, and see how adjusting certain parameters will change the sound. 101010a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"111000 Go here to read the documentation on javascript Audio.101010/a111000 
