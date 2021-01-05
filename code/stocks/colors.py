from random import randint

reset       = '\u001b[0m'
dark_blue   = '\u001b[38;2;63;94;143m'
bold        = '\u001b[1m'
clear_screen= '\033[2J'
cyan        = '\u001b[96m'
yellow      = '\u001b[93m'
green       = '\u001b[92m'
red         = '\u001b[91m'
show_cursor = "\033[?25h"
hide_cursor = "\033[?25l"
blink       = "\033[5m"
stop_blink  = "\033[25m"
magenta     = '\x1b[95m'
faint       = '\x1b[2m'

def rgb(r,g,b):
    return f'\u001b[38;2;{r};{g};{b}m'

def bg_rgb(r,g,b):
    return f'\u001b[48;2;{r};{g};{b}m'

def rand_f():
    r = randint(0,255)
    g = randint(0,255)
    b = randint(0,255)
    return f'\u001b[38;2;{r};{g};{b}m'

def rand_b():
    r = randint(0,255)
    g = randint(0,255)
    b = randint(0,255)
    return f'\u001b[48;2;{r};{g};{b}m'
    

