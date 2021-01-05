# this script encodes an html file in place

import sys

if __name__ == "__main__":

    _of   = open("final.html", "w+")
    _if = open(sys.argv[1])
    
    html = _if.readlines()

    stylin = 0
    line = -1
    while 1:
        line += 1
        _of.write(html[line])
        if "<pre>" in html[line]:
            break
    
    while 1:
        line += 1
        if "</pre>" in html[line]:
            break

        if "</style>" in html[line]:
            stylin = 0;

        if stylin:
            r = html[line]
            if "{" in html[line]:
                r = '<bl>'
                r = r + html[line].replace("{", "{</bl>")
                _of.write(r)
            elif "}" in html[line]:
                r = html[line].replace("}", "<bl>}</bl>")
                _of.write(r)
            else:
                
                _of.write("<css>" + r[:-1] + "</css>\n")
            continue

        if "<style>" in html[line]:
            stylin = 1;
        
        r = html[line].replace("<", "<y*^+&lt")
        r = r.replace(">","&gt</y>")
        r = r.replace("*^+", ">")
        _of.write(r)

    while line < len(html):
        _of.write(html[line])
        line += 1

    _if.close()
    _of.close()
        
