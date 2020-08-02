# What is this?
Simple and responsive browser-based games.  
Bringing the 1970's terminal experience to the modern day internet consumer.  
Explore puzzles in math, programming, and operating systems.  

# [TERMINAL](https://boris-volkov.github.io/games/terminal.html)
  - type help to get started.
  - A custom terminal shell emulator with some strange options
  - this page can navigate the rest of the site through program commands
  - extends all of the color and topological functionality of gradient_phase

# [The Princess's Test](https://boris-volkov.github.io/games/princess/rules.html)
  - proof of concept game for the project, based on one of Raymond Smullyan's puzzles
  - when player is finished with the rules, opens the next page with the game terminal.

# [Sixteen](https://boris-volkov.github.io/games/sixteens/sixteens.html)
  - topological rubik's cube style puzzle - mix it up and try to put it back together
  - i,j,k,l keys shift the grid around a torus
  - w,a,s,d keys shift like around a real-projective-plane (mobius strip in every direction)

# [Gradient Phase](https://boris-volkov.github.io/games/sixteens/gradient.html?size=32)
  - yes it just looks like a grey square at first.
  - user controls parameters on three sine waves that determine RGB codes for a gradient
  - '.' toggles an info display (freq is in terms of canvas size).
  - to alter Red Phase, for example: hold r,p, and press up or down arrows to adjust.
  - for a first time, I reccomend setting all magnitudes to 125, green phase to 11, blue phase to 22, for a rainbow.
  - translation works in the same way as in the sixteens game. 
  - source files in sixteens/ directory

# [Calculator Quest](https://boris-volkov.github.io/games/quest/quest.html)
  - UNDER CONSTRUCTION (problem selection algorithms need to be brought in from the Python version)
  - the timer bar and terminal prompt operate asynchronously now
  - TODO: figure out how to send scores to a permanent scoreboard
  - TODO: color design, have it change color with time of day, blue in the morning and red in the night, as is most humane.
  - TODO: switch to using the canvas terminal once it's ready

## directories:
- xterm/..
  - soon to be deprecated in this project ( too annoying to work with )
  - The terminal emulator library
  - documentation at xtermjs.org

- visual_design/..
  - sample visual designs for a terminal game
  
## General TODO:
- port over these games:
  - http://stocks.borisvolk.repl.run/
  - http://quest.borisvolk.repl.run/
  - http://logquiz.borisvolk.repl.run/
  - http://factorquiz.borisvolk.repl.run/
- store a score-board somewhere
