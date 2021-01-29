
const form         = document.querySelector("#parens");
const button       = document.querySelector("#button");
const picture      = document.querySelector("#picture");
const html_display = document.querySelector("#html");


/*
function get_color(depth){
    let red = 150 - 12 * depth
    let green = 150 - 15 * depth
    let blue = 150 - 18 * depth
    return red, green, blue;
}
*/

function submit_parens(){
	let writing_content = false;
	let string = form.value;
	if (test(string) === false) {
		reset();;
		return;
	}
	_of = '<div Class="holder">';
	_html = '&ltbody&gt<br/>';
    let depth = 0;
    for (let i = 0; i < string.length; i++){
		if (writing_content && '[]()'.includes(string[i])){
			writing_content = false;
			_html += "<br/>";
		}
        if (string[i] === '('){
            depth += 1;
			for (let i = 0; i < depth; i++){
				_of += ' ';
				_html += '&nbsp&nbsp';
			}
            _of += ('<div class="c">' + '\n');
			_html += ('&ltdiv class="c"&gt<br/>');
		} else if (string[i] === ')') {
			for (let i = 0; i < depth; i++){
				_of += ' ';
				_html += '&nbsp&nbsp';
			}
            _of += ('</div>\n');
			_html += ('&lt/div&gt<br/>');
            depth -= 1;
		} else if (string[i] === '[') {
			depth += 1
			for (let i = 0; i < depth; i++){
				_of += ' ';
				_html += '&nbsp&nbsp';
			}
            _of += ('<div class="r">\n');
			_html += ('&ltdiv class="r"&gt<br/>');
		} else if (string[i] === ']') {
			for (let i = 0; i < depth; i++){
				_of += ' ';
				_html += '&nbsp&nbsp';
			}
            _of += ('</div>\n');
			_html += ('&lt/div&gt<br/>');
			depth -= 1;
		} else {
			if (writing_content){
				_html += string[i];
				_of += string[i]
			} else {
				for (let i = 0; i < depth + 1; i++){
					_html += '&nbsp&nbsp';
				}
				_of += string[i];
				_html += (string[i])
				writing_content = true;; 
			}
		}
	}
    _of += '</div>';
	_html += '&lt/body&gt';
	picture.innerHTML = _of;
	html_display.innerHTML = _html;

}

function reset(){
	html_display.innerHTML = '?'
	picture.innerHTML = 'invalid';
	return false;
}


function test(x){
	let s = []; // stack
	for (let i = 0; i<x.length; i++){
		if (x[i] === '(')
			s.push('(');
		if (x[i] === ')')
			if (s.pop() === '(')
				continue;
			else
				return false;
		if (x[i] === '[')
			s.push('[');
		if (x[i] === ']')
			if (s.pop() === '[')
				continue;
			else
				return false;
	}
	return (s.length === 0);
}

button.onclick = submit_parens;
clear.onclick = () => {
	form.value = '';
	picture.innerHTML = "Enter a valid string of parenthese above.<br/>For example: (())()<br/>Then press play or ENTER<br/>";
	html_display.innerHTML = '';
};
document.onkeypress = (e) => {
	if (e.key === "Enter")
		submit_parens();
};


            //_of += (' '*depth + '<div style="background:rgb{0}">'.format(get_color(depth)) + '\n')
