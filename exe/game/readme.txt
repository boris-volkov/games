Here is a 2d game engine written in javascript using the HTML canvas interface. 
The little robot can jet around, jump multiple times, and throw a ball.

Keyboard/Mouse controls:
	wasd/arrows: move
	mouse: throw ball
	[ : shorter trail
	] : longer trail
	- : thinner trail
	= : wider trail
	. : display physics
	h : toggle platforms/floor
	g : toggle sprite visibility

As it is, this is not really a "game" yet, since there is not really any goal. Instead, it offers an engine that can be used as a foundation for a game. It is here to show you how you can start setting up keyboard controls, jumping, gravity, friction, collisions, item interactions, and animations - all the elements that are needed to start making a platformer game. There is quite a lot of code here, so be patient if you would like to understand this one. A lot of work goes into making the physics in a game feel right: is the movement smooth? do the collisions feel solid? is the jump satisfying? In a game it should feel fun just to move around, even if there is nothing to do.

advanced practice:
take any parts that you like from this code and combine them to make your own 2D game.
