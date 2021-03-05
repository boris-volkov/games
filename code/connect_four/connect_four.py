import sys
import time

# global assets
shade = '◡' 
dot = '◉'
star = '◎'
margin = '   '

# this class is basically being used as a module
# not everything is used, just here for demo
# look up ANSI escape codes if you are confused
class colors:
    # general colors
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
   
    # the circled numbers for the column bases:
    base_nums = ['\U00002460', '\U00002461', '\U00002462', 
                 '\U00002463', '\U00002464', '\U00002465', 
                 '\U00002466', '\U00002467', '\U00002468', 
                 '\U00002469', '\U0000246a', '\U0000246b', 
                 '\U0000246c', '\U0000246d', '\U0000246e', 
                 '\U0000246f', '\U00002470', '\U00002471', 
                 '\U00002472', '\U00002473',]

    def rgb(r,g,b):
        return f'\u001b[38;2;{r};{g};{b}m'

    def bg_rgb(r,g,b):
        return f'\u001b[48;2;{r};{g};{b}m'

    # specific colors for this game
    blue   = rgb(70,70,250)
    yellow = rgb(250,250,50)
    purple = rgb(150,0,50)
    red    = rgb(250, 50,150)
    green  = rgb(50,250,50)
    white  = rgb(210,220,255)

class Board:
    board = []

    def __init__(self, width, height):
        self.board = [[0]*width for i in range(height)] 
 
    def print_board(self,dot):
        for i in range(1,len(self.board[0])+1):
            rowstring = ''
            for j in range(len(self.board)):
                c = self.board[j][-i]
                if c == 'x':
                    rowstring = rowstring + colors.blue + dot + ' '
                if c == 'o':
                    rowstring = rowstring + colors.yellow + dot + ' '
                if c == 't':
                    rowstring = rowstring + colors.red + dot + ' '
                if c == 'u':
                    rowstring = rowstring + colors.green + dot + ' '
                elif c == 0:
                    rowstring = rowstring + colors.purple +shade + ' '
            print(margin + rowstring + colors.purple)
        print(margin, end = '')
        for i in range(len(self.board)):
            print(colors.base_nums[i] + ' ', end = '')
        print()


    def drop(self, row, mark):
        for i in range(len(self.board[row])-1,-1,-1):

            print(colors.clear_screen)
          
            print(' ')
            if self.board[row][i] == 0:
                self.board[row][i] = mark
                Board.print_board(self, dot)
                if i == 0 or not self.board[row][i-1] == 0:
                    print(colors.clear_screen)
                    Board.print_board(self, star)
                    print('\n', end = '\r')
                    time.sleep(0.3)
                    print(colors.clear_screen)
                    Board.print_board(self, dot)
                    print('\n', end = '\r')
                    return
                print()
                time.sleep(0.1)
                self.board[row][i] = 0
    
    def check_four(self):
        counter = 0
        width = len(self.board[0])
        height = len(self.board)
       
        #verticals
        for row in range(height):
            for col in range(1,width):
                if self.board[row][col] == self.board[row][col-1]:
                    if self.board[row][col] != 0:
                        counter += 1
                        if counter == 3:
                            return True
                else:
                    counter = 0
            counter = 0
        counter = 0

        #horizontals
        for col in range(width):
            for row in range(1,height):
                if self.board[row][col] == self.board[row-1][col]:
                    if self.board[row][col] != 0:
                        counter += 1
                        if counter == 3:
                            return True
                else:
                    counter = 0
            counter = 0
        counter = 0
 
        #south-east/north-west diagonals
        for a in range(height - 3):
            for i in range(width - 3):
                for j in range(3):
                    if self.board[a + j][i + j] == self.board[a + j + 1][i + 1 + j]:
                        if self.board[a + j][i + j] != 0:
                            counter += 1
                            if counter == 3:
                                return True
                    else:
                        counter = 0
                counter = 0
        counter = 0
    
        #south-west/north-east diagonals
        for a in range(height - 3):
            for i in range(3, width):
                for j in range(3):
                    if self.board[a + j][i - j] == self.board[a + j + 1][i - j - 1]:
                        if self.board[a + j][i - j] != 0:
                            counter += 1
                            if counter == 3:
                                return True
                    else:
                        counter = 0
                counter = 0
        return False

    def is_space(self,x):
        return self.board[x][-1] == 0


if __name__ == '__main__':
    print(colors.hide_cursor)
    print(colors.clear_screen)
    # if the program is called without arguments:
    if len(sys.argv) == 1:
        B = Board(9,9)
        width = 9
        height = 9
        B.print_board(dot)
        print(margin + colors.white + '\U000023C1 ' + colors.blue + dot+' ' + 
            colors.yellow + dot)
        players = 2
    else: # this stuff is here to allow for multiple players
        height = int(sys.argv[1])
        width = int(sys.argv[2]) #these are the apparent height and width on screen
        B = Board(height,width)
        B.print_board(dot)
        num_players = sys.argv[3]
        num_players = int(num_players)
        if num_players == 4:
            print(margin + colors.white + '\U000023C1 ' + colors.blue + dot+' ' + 
                colors.yellow + dot + colors.red + ' ' +  dot + colors.green + ' ' + dot)
        if num_players == 3:
            print(margin + colors.white + '\U000023C1 ' + colors.blue + dot+' ' + 
                colors.yellow + dot + colors.red + ' ' +  dot)
        
        if num_players == 2:
            print(margin + colors.white + '\U000023C1 ' + colors.blue + dot+' ' + 
                colors.yellow + dot)

    while not B.check_four():
        clrs = [colors.blue, colors.yellow, colors.red, colors.green]
        tokens = ['x', 'o', 't', 'u']
        for i in range(num_players):
            p1 = input(margin+clrs[i]+' ' + dot + ' : ')
            while not p1.isnumeric() or (int(p1) > width or int(p1) < 1) or not B.is_space(int(p1)-1):
                print(colors.clear_screen)
                B.print_board(dot)
                print(margin + colors.red + 'try again')
                p1 = input(clrs[i] +' ' +' ' + dot + ' : ')

            row = int(p1) - 1
            B.drop(row, tokens[i])

            if B.check_four() == 1:
                print(margin + clrs[i] + ' ' + dot + ' wins', end = '')
                input()
                break
    
    print(colors.show_cursor)
