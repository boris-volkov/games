# TODO quote searching breaks on empty quotes ''

import sys, os.path, re

import time

special_symbols = list('[](){};')

js_reserved = [
    "await",    "break",    "case",
    "catch",    "class",    "const",
    "continue", "debugger", "default",
    "delete",   "do",       "else",
    "enum",     "export",   "extends",
    "false",    "finally",  "for",
    "function", "if",       "implements",
    "import",   "in",       "instanceof",
    "interface","let",      "new",
    "null",     "package",  "private",
    "protected","public",   "return",
    "super",    "switch",   "static",
    "this",     "throw",    "try",
    "True",     "typeof",   "var",
    "void",     "while",    "with",
    "yield",
]

py_reserved = [
    'False',    'None',     'True', 
    'and',      'as',       'assert', 
    'async',    'await',    'break', 
    'class',    'continue', 'def', 
    'del',      'elif',     'else', 
    'except',   'finally',  'for', 
    'from',     'global',   'if', 
    'import',   'in',       'is', 
    'lambda',   'nonlocal', 'not', 
    'or',       'pass',     'raise', 
    'return',   'try',      'while', 
    'with',     'yield'
]

c_reserved = [
    'auto',     'break',    'case',
    'char',     'const',    'continue',
    'default',  'do',       'double',
    'else',     'enum',     'extern',   
    'float',    'for',      'goto',
    'if',       'inline',   'int',
    'long',     'register', 'restrict',
    'return',   'short',    'signed',
    'sizeof',   'static',   'struct',
    'switch',   'typedef',  'union',
    'unsigned', 'void',     'volatile',
    'while',    '_Alingas', '_Alignof',
    '_Atomic',  '_Bool',    '_Complex',
    '_Decimal128',          '_Decimal32',
    '_Decimal64',           '_Generic',
    '_Imaginary',           '_Noreturn',
    '_Static_assert',       '_Thread_local',
]


def findWholeWord(w):
    return re.compile(r'\b({0})\b'.format(w)).search

if __name__ == "__main__":

    if os.path.exists("./" + sys.argv[1] + "formatted.html"):
        os.remove("./" + sys.argv[1] + "formatted.html")

    js_readers = []
    html_readers = []
    css_readers = []
    txt_readers = []
    py_readers = []

    for (root, subs, files) in os.walk("./" + sys.argv[1]):
        for name in files:
            if name.endswith('.js'):
                with open(root+name) as temp:
                    js_readers.append([root+name] + temp.readlines())
            if name.endswith('.html'):
                with open(root+name) as temp:                
                    html_readers.append([root+name] + temp.readlines())
            if name.endswith('.css'):
                with open(root+name) as temp:                
                    css_readers.append([root+name] + temp.readlines())
            if name.endswith('.txt'):
                with open(root+name) as temp:                
                    txt_readers.append([root+name] + temp.readlines())
            if name.endswith('.py'):
                with open(root+name) as temp:                
                    py_readers.append([root+name] + temp.readlines())

    _tp     = open("./templates/template.html")
    template    = _tp.readlines()
    _of     = open("./" + sys.argv[1] + "formatted.html", "w+")

    i = 0
    while "WRITE_HERE" not in template[i]:
        _of.write(template[i])
        i += 1

    for txt in txt_readers:
        _of.write('<div class="bookmark">' + txt[0]  +  '</div>')
        _of.write("<pre class=notes>\n")
        for line in txt[1:]:
            _of.write(line)
        _of.write("</pre>\n")

    for html in html_readers:
        _of.write('<div class="bookmark">' + html[0]  +  '</div>')
        _of.write("<pre class=html>\n")
        for line in html[1:]:  
            r = line.replace("<", "<kw*^+&lt")  #  *^+ is just a token for 
            r = r.replace(">","&gt</kw>")       
            r = r.replace("*^+", ">")           #  this line to match. Weird, i know...
            if "<kw>&lt!--" in r:
                r = r.replace("<kw>&lt!--", '<comment class="html">&lt!--')
                r = r.replace("--&gt</kw>", '--&gt</comment>')
            _of.write(r)
        _of.write("</pre>\n")

    for css in css_readers:
        _of.write('<div class="bookmark">' + css[0]  +  '</div>')
        _of.write("<pre class=css>\n")
        for line in css[1:]:
            r = line
            if "{" in line:
                r = "<sc>"
                r = r + line.replace("{", "{</sc>")
            elif "}" in line:
                r = line.replace("}", "<sc>}</sc>")
            else:
                r = "<css>" + r[:-1] + "</css>\n"

            if "/*" in r:
                r = r.replace('/*', '<comment class="css">/*')
                r = r.replace('*/', '*/</comment>')

            _of.write(r)
        _of.write("</pre>\n")

    for js in js_readers:
        _of.write('<div class="bookmark">' + js[0]  +  '</div>')
        _of.write("<pre class=js>\n")
        for line in js[1:]:
            for word in js_reserved:
                if findWholeWord(word)(line):
                    line = line.replace(word, "<kw>" + word + "</kw>")
            for sym in special_symbols:
                if sym in line:
                    line = line.replace(sym, "<sc>" + sym + "</sc>")
            if "//" in line:
                line = line.replace('//', '<comment class="js">//', 1)
                line = line[:-1] + "</comment>\n"
            line = line.replace('/*', '<comment class="js">/*')
            line = line.replace('*/', '*/</comment>')
                
            _of.write(line)
        _of.write("</pre>\n")

    
    for py in py_readers:
        dbl_quote = 0
        sgl_quote = 0
        _of.write('<div class="bookmark">' + py[0] + '</div>')
        _of.write("<pre class=py>\n")
        for line in py[1:]:
            line = line.replace("<", "&lt")
            line = line.replace(">", "&gt")
            for word in py_reserved:
                start = 0
                while x := findWholeWord(word)(line, start):
                    print('found', word, 'in', line)
                    line = line[:x.start()] + '<kw>' + word + '</kw>' + line[x.end():]
                    start = x.end() + len('<kw></kw>')
            for sym in special_symbols:
                if sym in line:
                    line = line.replace(sym, "<sc>" + sym + "</sc>")
            j = 0
            temp = list(line)
            while j < len(temp):
                if temp[j] == '#' and dbl_quote == 0 and sgl_quote ==0:
                    temp[j] = '<comment Class="py">#'
                    temp.append('</comment>')
                    break
                if temp[j] == '"' and sgl_quote == 0:
                    if dbl_quote == 0:
                        temp.insert(j, '<dbl_quote>')
                        dbl_quote = 1
                    else:
                        temp.insert(j + 1, '</dbl_quote>')
                        dbl_quote = 0
                    j += 2
                    continue
                elif temp[j] == "'":
                    if sgl_quote == 0 and dbl_quote == 0:
                        temp.insert(j, '<sgl_quote>')
                        sgl_quote = 1
                    else:
                        temp.insert(j + 1, '</sgl_quote>')
                        sgl_quote = 0
                    j += 2
                    continue
                j += 1
            line = ''.join(temp)
            _of.write(line)
        _of.write("</pre>\n")


    i += 1
    while i < len(template):
        _of.write(template[i])
        i += 1
