import turtle, random, math

s = turtle.Turtle()
screen = turtle.Screen()
screen.screensize(2000,2000)
s.pencolor("white")
screen.colormode(255)
screen.bgcolor(30,60,90)
s.fillcolor((255,0,255)) # on a range of 0-255
s.pensize(3)
s.speed(0) # 1 - 10, but then 0 is faster than 10
s.hideturtle()


n = 400
for i in range(1, n):
    s.penup()
    s.forward(i*5)
    s.right(76)
    s.begin_fill()
    s.fillcolor(round(125*math.sin(20*i/n)) + 125, 
                round(125*math.sin(30*i/n)) + 125, 
                round(125*math.sin(i/n)) + 125)
    for j in range(6): # nested loops
        s.forward(20)
        s.left(60)
    s.end_fill()
    s.right(95)

