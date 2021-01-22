import turtle

s = turtle.Screen()
s.screensize(1152, 1024)
s.colormode(255)
s.bgcolor((16,32,48))

t = turtle.Turtle()
t.pensize(1)
t.speed(0)
t.pencolor((230, 100, 250))
t.hideturtle()
t.penup()
t.goto(0, 500)
t.left(60)
t.pendown()

def fractal(length):
    if length <= 4:
        return
    for i in range(3):
        fractal(length//2)
        t.right(120)
        t.forward(length)

fractal(1024)

s.exitonclick()
