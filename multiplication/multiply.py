import random, time

cards = set()

for i in range(1,13):
    for j in range(i, 13):
        cards.add( (i, j, i*j) )


start_time = time.time()

while cards:
    a, b, answer = cards.pop()
    prompt = str(a) + ' x ' + str(b) + ' = '

    my_answer = -1

    while my_answer != str(answer):
        my_answer = input(prompt)

time_taken = time.time() - start_time

print('it took you ', time_taken, ' seconds!')
print('great job!')
