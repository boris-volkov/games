import turtle, math

s = turtle.Screen()
s.screensize(2000,2000)
s.colormode(255)
s.bgcolor(30,60,90)

t = turtle.Turtle()
t.fillcolor((255,0,255)) # on a range of 0-255
t.speed(0) # 1 - 10, but then 0 is faster than 10
t.hideturtle()
t.penup()

n = 400
for i in range(1, n):
    t.forward(i*5)
    t.right(171)
    t.begin_fill()
    t.fillcolor(round(125*math.sin(20*i/n)) + 125, 
                round(125*math.sin(30*i/n)) + 125, 
                round(125*math.sin(i/n)) + 125)
    for j in range(6): # hexagon
        t.forward(20)
        t.left(60)
    t.end_fill()

s.exitonclick()

