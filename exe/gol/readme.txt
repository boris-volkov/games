This is an interface into John Conway's "Game of Life". This is probably the most famous of the cellular automatons - basicly games that can be played on a sheet of graph paper, marking certain squares as "on" and others as "off", and the game progressing in steps based on the current position of the board.

This particular game progresses by the following rules:
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
oOr, equivalently:
    Any live cell with two or three live neighbours survives.
    Any dead cell with three live neighbours becomes a live cell.
    All other live cells die in the next generation. Similarly, all other dead cells stay dead.

You can play this game yourself on graph paper, but you will find it's rather hard to keep track of what's happening, especially because the entire grid needs to change "at once" each generation, and not square by square. It's much more fun to let a computer, which can do millions of calculations pre seoond, to do the counting for us. Then we can really see the grid come to life.

There is no real goal to the game, other than to search out starting positions that have interesting lives. 
this combination, for example:

		░░░░░░░░░
		░░●░░░░░░
		░░●░●●●░░
		░░●░░░░░░
		░░░░░░░░░

evolves in a very interesting way. Can you find any other interesting patterns? Click on squares to turn them on. The counter at the bottom right of the board counts how many generations have passed since you last clicked. You can make a generation pass by pressing the leftmost button, or you can play it as an animation with the play button. The square pauses the game, and the back button returns you to your last set up. The final button clears the screen. You can alwalys just refresh the page to reset it as well.

Additionally, for speed there are also keyboard controls:

		[n]  next generation
		[p]  play
		[s]  stop
		[x]  clear
		[r]  reset to last setup

Oh, and one more important detail: I've altered the game a little here. The trouble is in how to deal with the edges of the board. There are several ways to answer this question: you can treat it as if your board is just a section of an infinite board stretching out in all directions, so if you send out a glider, it will just go on out of the edge and on to infinity. Another way is to treat the squares outside of the board as if they do not exist at all, as if there is a wall around the boundary of the grid. In this universe, a glider will hit the wall and turn into a 2x2 square. There is another way, which is to topologically identify the grid as a torus, by linking the right edge to the left edge, and the top edge to the bottom edge. In this world, a spaceship the leaves the left edge, will fly in seamlessly from the left edge. (like the old asteroids game) This is the way that I have chosen for this current application. I've found that there is more opportunity for life in this kind of universe, though of course this is not quite the "classic game of life" in which you can do crazy things like set up  Turing Machines that operate things like digital clocks and even the game of life itself. In order to mod this torroidal universe into that infinite one, you will have to adjust the count neighbors function, and add methods to dynamically resize the grid based on where the action is. This would be a good project.

In this current version, you can change the size of the grid through url parameters, to do this you have to take your mouse and keyboard, and add to the URL of the page :    ?rows=100&cols=200     no spaces!. so the URL would look something like: 

	https://boris-volkov.github.io/games/exe/gol/main.html?rows=100&cols=200

Load the page with this new URL, and the grid will now be 100 rows by 200 columns.

Okay, that's all you need to know. Now have fun with it. As always, the code is below, and you should take a look under the hood to see how all this works. 
