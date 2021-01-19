import turtle, math

s = turtle.Screen()
s.screensize(640,640)
s.colormode(255)
s.bgcolor((16,32,48))

t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.penup()

n = 180 # number of colors

def color(i, sat):
    b = sat*math.sin(2*math.pi/n*(i)) + 125
    r = sat*math.sin(2*math.pi/n*(i+n/3)) + 125
    g = sat*math.sin(2*math.pi/n*(i+2*n/3)) + 125
    return (round(r),round(g),round(b))

def spiral(i,r):
    x = math.cos(2*math.pi/n*i)*r
    y = math.sin(2*math.pi/n*i)*r
    return (round(x),round(y))

for i in range(1,7):
    for j in range(n):
        x,y = spiral(j,280-40*i)
        t.goto(x,y)
        if j%i == 0:
            t.pencolor(color(j, 125-20*i))
            t.dot(100-8*i)

s.exitonclick()
