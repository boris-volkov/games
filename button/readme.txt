Here is a visually responsive button. It changes color when you move your mouse over it, and it changes color again when you click it. 

Notice in the html I am treating the empty <a> element just like I use a div in a flex box. 
In fact, it is given the same characteristics as the divs in the style sheet. 

notice how I identify the button in the css.

a.button:hover {
	background-color : #369;
}

refers to an <a> element with class="button" at the time it is being hovered over with the mouse

a.button:active {
	background-image: radial-gradient(#123, #247, #369);
}

refers to an <a> element with class="button" at the time it is being clicked. 
Here I also demonstrate how you can use a gradient instead of single color.

To make this button go somewhere, just add href="somewhere" in the <a> tag.

advanced practice:

attach an event listener to it in a javascript file and make it do something interesting.


