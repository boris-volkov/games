### Terminal Games in the Browser! GUI programmers don't want you to know this one simple trick!

# About:
This is an input/output API that emulates a terminal in the browser. I was inspired by the kinds of terminal programs you can run in replit through repl.run, for example:

[arithmetic practice](http://quest.borisvolk.repl.run)

[day trading simulator](http://stocks.borisvolk.repl.run)

[logarithms](http://logquiz.borisvolk.repl.run)

[polynomial factoring](http://factorquiz.borisvolk.repl.run)

I think this is a refreshingly simple way to engage with a website, and there's a lot of potential for some clean educational games for math, proramming, logic, etc. Any contributions are welcome. I want to make a whole website of these. Running them through repl is okay, but It's much better to be able to control the terminal colors, fonts, font-size, etc. These can be made to look really professional. Also, the problem with the repl.run terminal is that it times out after a few minutes of inactivity, killing any progress. Here we have the opportunity to experiment with really retro style educational games. 

Edit: added a logic/programming game as proof of concept. This program can be used as a math competition.

- princess.html
  - proof of concept game for the project, based on one of Raymond Smullyan's puzzles
  - run it in your favorite browser.
  - runs two terminals in the same window, one to teach rules, one to conduct the challenge
  - TODO: fix the awkward placement and make things fit nicely to screen
  - TODO: get the dimensions of the users browser and based text-size on that, we want it to look good on any monitor!
  - TODO: a side-by side orientation like a book could be nice... 

- screen_fit.png
  - Ideally how I would like this to fit in a screen on first load and resize, etc
  - always going for clean

- princess.js
  - logic for the princess game and a record of her challenges
  - it doens't work all the way to the end yet. This is actually a really hard puzzle.

- rules.js
  - logic for the rules terminal which has users progress through the rules as a preliminary challenge.
  - these two js files running in the same html file share data! This surprised me
  - JavaScript is surpisingly "concurrent". I've often found lines acting "out of order"

- code.js
  - the API for the browser terminal
  - currently saving the buffer into a string and printing it on ENTER press
  - but this buffer string can be sent into another program for the game logic
  - TODO: KEITH needs to figure out how to make the fonts wider
  - The reason I want to have square is for games like connect4, etc. or anywhere you try to use the unicode bar as a "pixel"

- browser_terminal_no_logic.html
  - most basic IO terminal template. most games will be built around this.
  - has my added logic to read a "buffer". might be redundant but i don't know.
  - fills the entire window with the terminal emulator
  - run in your browser to see the terminal

- calculator_quest_stats.png
  - pyplot data from the arithmetic challenge in the links above
  - left is histogram of all players scores (around 200 unique players)
  - right progress chart of the game's "biggest fan". about 5 months of progress.
  - smart kids really enjoy these! they appreciate the speed of a terminal.

- xterm/..
  - a bunch of typescript files that make the terminal run
  - documentation at xtermjs.org

- visual_design/..
  - sample visual designs for a terminal game
  - all done with unicode characters for shapes, and ansi escape sequences for colors. (like '\x1b[96m')



#afterword: 
This is an open source project! Anyone who has something to contribute please feel free. This is for education. You might as well help out. Think about it... you don't have anything better to do!
