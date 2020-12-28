
This picture is made entirely of empty div's with the style property : "display : flex;", turning them into what is called a flex-box.

Modern HTML layouts use flex-boxes heavily because they solve a lot of the difficulties that float elements caused over decades of web development. Flex-boxes are the answer to most layout questions, scale well to small screens, and make it very easy to keep elements centered, aligned, and well-balanced. Flex-boxes can be set to align their elements in rows or in columns with the flex-direction style property. They have other properties that can be set in the style sheet. These include setting how items wrap when the flex-box is resized, and how items are spaced out in the box. You can read about them <a href="https://developer.mozilla.org/en-US/docs/Glossary/Flex_Container">here</a>.

The reason that these empty divs are visible is that they have the margin and padding properties set, and are assigned background colors in the style sheet. Any of these divs can contain pictures or text, or be shifted around inside thier boxes, and the nesting structure of the divs determines the layout. 

Try to understand how the html below leads to the picture you see above. The indentation in the code is designed to make the nesting structure more clear. The deeper an element is nested in the structure, the further it is indented. 

To practice:

Here is the full set of <a href="./extras_/div_trees.html">the 6 div column structures</a>. Of course, any column structure can be exchanged for a row structure by changing "flex-direction : column;" to "flex-direction : row;" in that div's style description. Find a layout that you like, and try to replicate it as a nested structure of flex-boxes, then either add images or text if you like, or choose your own background colors and other settings. Make it your own!
