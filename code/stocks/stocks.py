import random, colors, sys

class stock_ticker():
    def __init__(self, initial_price, investment):
        self.price = initial_price
        self.account = investment
        self.num_shares = 0
        self.days = 0
        self.total_days = 0
        self.month_average = 0
        self.month = []
        self.price_history = [float('inf')]

    def month_avg(self):
        self.month.append(self.num_shares*self.price)
        try:
            self.month_average = sum(self.month)/len(self.month)
        except DivisionByZeroError:
            self.month_average = 0

    def die(self):
        if self.account > 0:
            return
        print(colors.clear_screen)
        print(colors.red, 'you ran out of money.\n you died ☠')
        input()
        sys.exit(0)

    def pay_rent(self):
        print('   Pay rent:', colors.red, '$500', colors.reset)
        print('3% dividend:', colors.green,  '${0:.2f}'.format(self.month_average/33.3), colors.reset)
        input()
        print(colors.clear_screen)
        self.account += self.month_average/33.3
        self.account -= 500
        self.month = []

    def ideal_play(self):
        self.price_history.append(-float('inf'))
        month = []
        bank = 10000
        shares = 0
        for i in range(1, len(self.price_history)-1):
            price = self.price_history[i]
            month.append(shares*price)
            if price < self.price_history[i+1]:
                if price < self.price_history[i-1]:
                    shares_to_buy = bank//price
                    bank -= shares_to_buy*price
                    shares = shares_to_buy
            if price > self.price_history[i+1]:
                if price > self.price_history[i-1]:
                    bank += shares * price
                    shares = 0
            if i%30 == 0:
                bank -= 500
                bank += sum(month)/30*0.03
                month = []
        return bank + shares*self.price_history[-2]

    def start(self):
        while 1:
            self.die()
            self.month_avg()
            print(colors.clear_screen)
            #print(self.month_average)
            self.days = (self.days + 1)%30
            self.total_days += 1
            if self.total_days == 364:
                print("final day!")
            if self.total_days == 365:
                print('the year is up')
                print('you ended up with')
                print(colors.cyan + '  ', '${0:,.2f}'.format(self.account + self.num_shares*self.price), colors.green)
                print('with perfect choices,\n it could have been:\n '+ colors.cyan, '${0:,.2f}'.format(self.ideal_play()))
                input(colors.reset)
                return
            if self.days == 0:
                self.pay_rent()
                self.die()
            print(colors.green + 'Day:', colors.cyan, self.total_days, '/ 365', colors.reset)

            print('Rent due in'+colors.red, 30 - self.days, colors.reset + 'days:',colors.red +  '$500', colors.yellow)
            print('3% dividend paid monthly')
            print('   on average holding.')
            print('-'*26, colors.reset)
            change = random.gauss(0,4)

            if change > 0:
                color = colors.green
            else:
                color = colors.red
            self.price += change
            self.price_history.append(self.price)
            if self.price < 0:
                print(colors.red, 'This company went out of business, sorry ☠')
                self.account += self.num_shares*self.price
                print('You ended up with')

                print('{0:.2f}'.format(self.account))
                input('')
                return
            print('Your cash balance:', colors.cyan)
            print()
            print('      ', '${0:,.2f}'.format(self.account))
            print(colors.reset)
            print('Current price per share:', color)
            print()
            print('      ', '${0:.2f}'.format(self.price))
            print(colors.reset)
            print('You own', colors.yellow, self.num_shares, \
                    colors.reset, 'shares, worth:', colors.yellow)
            print()
            print('      ', '${0:,.2f}'.format(self.price*self.num_shares))
            print(colors.green)
            choice = input('Buy/Sell/Skip? (b/s/enter):')
            if 'b' in choice:
                try:
                    number = int(input("how many shares? "))
                except:
                    continue
                self.account -= number*self.price
                self.num_shares += number
            if 's' in choice:
                try:
                    number = int(input("how many shares? "))
                except:
                    continue
                if number > self.num_shares:
                    self.account += self.num_shares*self.price
                    self.num_shares = 0
                else:
                    self.account += number*self.price
                    self.num_shares -= number
            

s = stock_ticker(100, 10000)
s.start()

