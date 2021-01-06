import time, random

deck = []             # empty list for the deck
for i in range(1,13): # fill the deck with cards
    for j in range(i, 13):
        deck.append( (i, j, i*j) )

for _ in range(1000): # 1000 swaps to scramble
    a = random.randint(1, len(deck)-1)
    b = random.randint(1, len(deck)-1)
    deck[a], deck[b] = deck[b], deck[a] # python swap

start_time = time.time()

for i in range(len(deck)):
    a, b, answer = deck[i] 
    prompt = str(a) + ' x ' + str(b) + ' = '

    # setting initial false value to 
    # get the loop going:
    my_answer = -1  
    while my_answer != str(answer):
        my_answer = input(prompt)

time_taken = time.time() - start_time

print('It took you ', time_taken, ' seconds!')
print('Great job!')
