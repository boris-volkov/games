import turtle

s = turtle.Screen()
s.screensize(2000,2000)
s.colormode(255)
s.bgcolor((16,32,48))

t = turtle.Turtle()
t.pensize(1)
t.speed(0)
t.pencolor((230, 200, 250))
t.hideturtle()

def fractal(length):
    if length <= 2:
        return
    for i in range(3):
        fractal(length//2)
        t.left(360//3)
        t.forward(length)

t.penup()
t.goto(500,-250)
t.pendown()

fractal(1024)

s.exitonclick()
