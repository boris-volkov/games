Here is a program that does a very simple but useful thing. 
It quizzes you on the entire 1-12 multiplication table, and times you.
The more you practice, the quicker your time gets.

It stores each multiplication fact as a tuple, and stores all of them in a list called "deck".

we then scramble the set by swapping two random cards 1,000 times. 1000 seems like enough times...

note the indexing operation: deck[3], for example, means the 3rd element in the deck list (counting from 0).

The program then iterates through the scrambled deck, continuing to ask each card in a "while" loop until you enter the correct answer. 

Once it gets to the end of the deck, the program calculates the amount of time taken, and prints it.

This is a console program, which means it will be very fast. You can just run the file in a terminal with the command: python3 multiplication.py from the directory where it is saved. Or copy the code into your IDE and run it there. Study the program, and maybe even use it to practice your mutiplication table!


technical notes:

The call to time.time() returns the number of seconds since new year 1970. It may seem like a strange way to measure time, but that is how all computers are calibrated. The moment the function time.time() it returns the current time in seconds since 1970, so the number will be over one billion. That is fine, and we do not need to do any conversion, simply call time.time() again after the cards loop finishes, subtract the times, and you get how many seconds were in between, and that's the number to print().
