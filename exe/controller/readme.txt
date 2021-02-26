This is a proof-of-concept for a game controller interface for tablets. 

Giving up buttons for touch-screens certainly means simplicity for the hardware manufacturer, and often simplicity for the user as well. The screen size can afford to be bigger, since no space is given away to the buttons. But something is lost too... The good thing about a game controller is that once you learn it, you can use it without having to look at it. 

This program attempts to bridge the gap by turning the tablet screen into a controller. The layout is all done with simple page divisions and css flexbox properties for layout. In fact, the only thing in the <body> that is not a <div> is the <canvas>. 

The game here is just a moving square, nothing special. This template can be an interface to a whole variety of games written in javascript. Take it and modify it for your purposes. Different buttons can be added for different purposes, the color of everything can be changed... It really depends on the requirements of your game. 

Many default touch controls had to be overridden in order to make sure that the player didn't accidentally scroll the page around or zoom in while tapping the buttons. Overriding defaults is one of the annoying but necessary things that have to be done in order to get programs running well on tablet. 
