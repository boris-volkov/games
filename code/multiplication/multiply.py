import time

cards = set()

for i in range(1,13):
    for j in range(i, 13):
        cards.add( (i, j, i*j) )

start_time = time.time()

while cards: # while there are still cards left
    a, b, answer = cards.pop() 
    prompt = str(a) + ' x ' + str(b) + ' = '

    # setting initial false value to 
    # get the loop going:
    my_answer = -1  
    while my_answer != str(answer):
        my_answer = input(prompt)

time_taken = time.time() - start_time

print('It took you ', time_taken, ' seconds!')
print('Great job!')
