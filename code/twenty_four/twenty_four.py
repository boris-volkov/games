import itertools, math

def solve(nums, TARGET = 5):
    # input a list (or tuple) of four numbers
    paren_patterns = ['%d %s %d %s %d %s %d',
                      '(%d %s %d) %s %d %s %d',
                      '(%d %s %d %s %d) %s %d',
                      '%d %s (%d %s %d) %s %d',
                      '%d %s (%d %s %d %s %d)',
                      '%d %s %d %s (%d %s %d)',
                      '(%d %s %d) %s (%d %s %d)',]

    operations = ['+','-','*','/']

    for pat in paren_patterns:
        num_gen = itertools.permutations(nums)
        for nums in num_gen:
            op_gen = itertools.product(operations,operations,operations)
            for ops in op_gen:
                inputs = (nums[0], ops[0], nums[1], ops[1], nums[2], ops[2], nums[3])
                try:
                    this = eval(pat % inputs)
                    if math.isclose(this, TARGET): print(pat % inputs, '=', TARGET)
                except ZeroDivisionError:
                    continue
    print('done')

# when calling from terminal:
if __name__ == '__main__':
    import sys
    nums = [int(i) for i in sys.argv[1:-1]]
    solve(nums, int(sys.argv[-1]))
