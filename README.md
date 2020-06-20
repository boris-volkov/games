### Terminal Games in the Browser! GUI programmers don't want you to know this one simple trick!

# About:
This is an input/output API that emulates a terminal in the browser. I was inspired by the kinds of terminal programs you can run in replit through repl.run, for example:

[arithmetic practice](http://quest.borisvolk.repl.run)

[day trading simulator](http://stocks.borisvolk.repl.run)

[logarithms](http://logquiz.borisvolk.repl.run)

[polynomial factoring](http://factorquiz.borisvolk.repl.run)

I think this is a refreshingly simple way to engage with a website, and there's a lot of potential for some clean educational games for math, proramming, logic, etc. Any contributions are welcome. I want to make a whole website of these. Running them through repl is okay, but It's much better to be able to control the terminal colors, fonts, font-size, etc. These can be made to look really professional. Also, the problem with the repl.run terminal is that it times out after a few minutes of inactivity, killing any progress. Here we have the opportunity to experiment with really retro style educational games. 

Edit: added a logic/programming game as proof of concept. This program can be used as a math competition.

- /sixteens/sixteens.html + sixteens.js
  - my original puzzle, rubik's cube style - mix it up and try to put it back together
  - try it [here](https://boris-volkov.github.io/browser_terminal_games/sixteens/sixteens.html)
  - i,j,k,l keys shift like around a torus
  - w,a,s,d keys shift like around a real-projective-plane (mobius strip in every direction)
  - I'm not sure if this exists already, but I came up with it while watching Joker (just a bit of trivia, doesn't mean anything)

- basic_terminal_code.js
  - the API for the browser terminal
  - now supports resizing font with window resize!

- basic_terminal_page.html
  - most basic IO terminal template. most games will be built around this.
  - fills the entire window with the terminal emulator
  - try it [here](https://boris-volkov.github.io/browser_terminal_games/basic_terminal_page.html)

- princess/princess.html+rules.html
  - proof of concept game for the project, based on one of Raymond Smullyan's puzzles
  - try it [here](https://boris-volkov.github.io/browser_terminal_games/princess/rules.html)
  - when player is finished with the rules, opens the next page with the game terminal.
  - TODO: lot of repeated code here... figure out a way to have them pull from a shared module?
  - TODO: still has not integrated the resizing feature

- princess/rules.js + princess.js
  - logic for the princess game and a record of her challenges
  - it doens't work all the way to the end yet. This is actually a really hard puzzle.

- xterm/..
  - a bunch of typescript files that make the terminal run
  - documentation at xtermjs.org

- visual_design/..
  - sample visual designs for a terminal game
  - all done with unicode characters for shapes, and ansi escape sequences for colors. (like '\x1b[96m')

#afterword: 
This is an open source project! Anyone who has something to contribute please feel free. This is for education. You might as well help out. Think about it... you don't have anything better to do!
