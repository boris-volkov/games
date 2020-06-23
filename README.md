# What is this?:
Simple and functional browser-based games. 
Running through the xterm terminal emulator and html canvas.
Bringing the 1970's terminal experience to the modern day internet consumer.

## [princess_test](https://boris-volkov.github.io/browser_terminal_games/princess/rules.html)
  - proof of concept game for the project, based on one of Raymond Smullyan's puzzles
  - when player is finished with the rules, opens the next page with the game terminal.
  - TODO: lot of repeated code here... figure out a way to have them pull from a shared module?
  - TODO: still has not integrated the resizing feature

## [sixteen](https://boris-volkov.github.io/browser_terminal_games/sixteens/sixteens.html)
  - topological rubik's cube style puzzle - mix it up and try to put it back together
  - i,j,k,l keys shift the grid around a torus
  - w,a,s,d keys shift like around a real-projective-plane (mobius strip in every direction)

## [gradient_phaser](https://boris-volkov.github.io/browser_terminal_games/sixteens/gradient.html?size=32)
  - yes it just looks like a grey square at first.
  - uses the same logic as the sixteens game, but adds interface for creating arbitrary gradients
  - '.' toggles on info display (feq is in terms of canvas size.
  - to alter Red Phase, for example: hold r,p, and press up or down arrows to adjust.
  - transformation works in the same way as in the sixteens game. 
  - source files in sixteens/ directory
  - TODO clean up repetitive code.

## [blank_terminal](https://boris-volkov.github.io/browser_terminal_games/basic_terminal_page.html)
  - most basic IO terminal template. text games will be built around this.
  - fills the entire window with the terminal emulator
  - TODO figure out a way to base screen size 

### directories:
- xterm/..
  - The terminal emulator library
  - documentation at xtermjs.org

- visual_design/..
  - sample visual designs for a terminal game
