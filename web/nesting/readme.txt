There is a natural correspondence between strings of parentheses and the nesting structures of html pages.

()() is a legal string of parentheses, and corresponds to a layout with two divisions separate from each other.

(()) is another legal arrangement, corresponding to a layout with one division inside of another.

Hn contrast, ())( is not a legal arrangement, and does not correspond to any layout. In general, every opening bracket must be matched by exactly one closing bracket. Every division that is opened must be closed.

With two types of brackets this gets more complex, as ()[] is a legal arrangement, but (][) is not, even though there is a closer for every opener, they also need to be of the same type. ([)] is also illegal since the square bracket opens inside of the round brackets, it must also close within them.

This tool lets you enter strings of brackets, and displays the general page structure that it corresponds to, as well as the properly indented html code which would set up that structure. An "opener bracket" ( or [, corresponds to a division opener <div> and a "closer bracket" ) or ], corresponds to a division closer </div>

Again, 
	opener: ( or [  =  <div>
	closer: ) or ]  =  </div>

() round brackets create column-oriented divisions, and [] square brackets create row-oriented divisions. This is done by the class labels and the corresponding entries in the style sheet. The class names r and c, standing for row and column, are arbitrary, but something like them is needed to link to the stylesheet.

You can use this tool to plan out your page layouts and then copy the html into your own editor to continue the work. 
