with open('trees.txt', 'r') as _if:
    paren_strings = _if.readlines()


_of = open('div_trees.html', 'w+')

_tp     = open("template.html")
template    = _tp.readlines()

def get_color(depth):
    red = 150 - 12 * depth
    green = 150 - 15 * depth
    blue = 150 - 18 * depth
    return red, green, blue

i = 0
while "WRITE_HERE" not in template[i]:
    _of.write(template[i])
    i += 1
count = 1
for string in paren_strings:
    _of.write('\n\n')
    _of.write('<div Class="holder">')
    _of.write(str(count))
    count += 1
    depth = 0
    for c in string:
        if c == '(':
            depth += 1;
            _of.write(' '*depth + '<div style="background:rgb{0}">'.format(get_color(depth)) + '\n')
        else:
            _of.write(' '*depth + '</div>\n')
            depth -= 1
    _of.write('</div>')

i += 1
while i < len(template):
    _of.write(template[i])
    i += 1
