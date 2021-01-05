Console programs can be made more aesthetic with color printing. 

Here is a small python module that can be imported and used in color printing to the console. Printing with colors in a terminal is a little strange, but this method is quite old and is probably not going anywhere. The color that text is printed in a terminal can be changed by printing special codes to the terminal. You actually do not see them print, but instead, the next thing that comes out will be in the desired color. These codes look like this:


\u001b[38;2;30;60;90m

that code is a mini program which sets the text color to rgb(30,60,90). That's sort of cool, but the code is very strange and hard to remember, so instead I wrote this module to let me auto-write these codes by using functions. 

Some of the more common colors are named, for conveneince, and there are functions to change the background and foreground colors, as well as to output random colors. There are also codes to hide the cursor or to make it blink. Look up Ansi Escape Codes on wikipedia for advanced practice.

example usage:

	import colors as c
	print(c.rgb(0,0,0) + 'black' + 
		  c.rgb(0,0,255) + 'blue' + c.reset())
	# reset() sets the color mode back to default.

They're actual strings to print, and yes, you have to print a string EVERY time you want to change the color, but you can write programs to automate it, and this can produce some nice effects. You can even print whole pictures to a terminal. A useful unicode character for this is the full block : unicode 2588 = █ , which can be used as a "pixel" in terminal pixel art/games.

There was once a time when this was the only way to play games, so people came up with some clever ways to do graphics with ansi codes and printing characters to the terminal. Ultimately, printing graphics to screen is no different from printing full block lines to a terminal screen, only the resolution is different. You can do a surprising amount of graphics with just the print() function.
