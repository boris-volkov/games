### Terminal in the browser

# About:
This is an input/output API that emulates a terminal in the browser. I was inspired by the kinds of terminal programs you can run in replit through repl.run, for example:

[arithmetic practice](http://quest.borisvolk.repl.run)

[day trading simulator](http://stocks.borisvolk.repl.run)

[logarithms](http://logquiz.borisvolk.repl.run)

[polynomial factoring](http://factorquiz.borisvolk.repl.run)

I think this is a refreshingly simple way to engage with a website, and there's a lot of potential for some clean educational games for math, proramming, logic, etc. Any contributions are welcome. I want to make a whole website of these. Running them through repl is okay, but It's much better to be able to control the terminal colors, fonts, font-size, etc. These can be made to look really professional. Also, the problem with the repl.run terminal is that it times out after a few minutes of inactivity, killing any progress. 

- code.js
  - the API for the browser terminal
  - currently saving the buffer into a string and printing it on ENTER press
  - but this buffer string can be sent into another program for the game logic
  - TODO: KEITH needs to figure out how to make the fonts wider
  - The reason I want to have square is for games like connect4, etc. or anywhere you try to use the unicode bar as a "pixel"

- only_term.html
  - fills the entire window with the terminal emulator
  - run in your browser to see the terminal

- works.html
  - webpage with terminal and some extra text on top that could be instructions
  - a version of the webpage with a title on top

- xterm/..
  - a bunch of typescript files that make the terminal run
  - documentation at xtermjs.org

 
