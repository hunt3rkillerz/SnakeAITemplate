// Board Pieces
const snakeBody = 10;
const snakeHead = 11;
const snakeTail = 12;
const blank = 0;
const food = 1;

const nothing = 0;
const up = 1;
const down = 2;
const left = 3;
const right = 4;
let keyVal = 0;

function checkKey(e) {

	e = e || window.event;
	if (e.keyCode == '38') {
		// up arrow
		keyVal = up;
	}
	else if (e.keyCode == '40') {
		// down arrow
		keyVal = down;
	}
	else if (e.keyCode == '37') {
	   // left arrow
	   keyVal = left;
	}
	else if (e.keyCode == '39') {
	   // right arrow
	   keyVal = right;
	}

}
document.onkeydown = checkKey;