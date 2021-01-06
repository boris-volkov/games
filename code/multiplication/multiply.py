import time, random

deck = []                               # empty list for the deck
for a in range(1,13):                   # fill the deck with cards
    for b in range(a, 13):
        deck.append( (a, b, a*b) )      # pack

for _ in range(1000):                   # 1000 swaps to scramble
    i = random.randint(1, len(deck)-1)  # pick two random
    j = random.randint(1, len(deck)-1)  # slots in the deck
    deck[i], deck[j] = deck[j], deck[i] # swap

start_time = time.time()                

for i in range(len(deck)):
    a, b, answer = deck[i]              # unpack
    question = str(a)+' x '+str(b)+' = '
    my_answer = -1                      # initial false value to
    while my_answer != str(answer):     # get the loop started
        my_answer = input(question)

time_taken = time.time() - start_time

print('It took you ', time_taken, ' seconds!')
print('Great job!')
