// VALUES

var SIZE_X = 4;
var SIZE_Y = 4;



var currentSumLabel = document.getElementById("current_sum");
var ramdomSumLabel = document.getElementById("random_sum");

var matrixValue;
var matrixGrid = document.getElementById("div_grid");

var elem_touch = document.getElementById("div_touch");

var infoText = document.getElementById("div_staus");

var level = 0;
var levelText = infoText.getElementsByTagName("p")[0];
var levelBar = document.getElementById("div_bar").getElementsByTagName("div")[0];

var best = 0;
var bestElem = infoText.getElementsByTagName("p")[1];

var total_spawn = 0;

var fontSize = 10;
var DIRECTION = {
	up 		: 1,
	right	: 2,
	left 	: 3,
	down 	: 4
}


function updateGridDisplay() {
	var e, x, y;

	for(y = 0; y < SIZE_Y; y++) {
		for(x = 0; x < SIZE_X; x++) {
			e = matrixGrid.getElementsByTagName("div")[(y * SIZE_X) + x];

			if(matrixValue[y][x] !== -1) {
				e.innerHTML = matrixValue[y][x];
				e.setAttribute("class", "b" + matrixValue[y][x]);
			} else {
				e.innerHTML = "";
				e.setAttribute("class", "bv");
			}
		}
	}
}

function moveGrid(direction) {
	var x, y, idx;

	var dontTouch = new Array();
	for(var y = 0; y < SIZE_Y; y++) {
		dontTouch[y]=new Array();
		for(var x = 0; x < SIZE_X; x++){
			dontTouch[y][x] = 0;
		}
	}
	
	if(direction === DIRECTION.up) {
		for(x = 0; x < SIZE_X; x++) {
			idx = 0;
			for(y = 1; y < SIZE_Y; y++) {
				if(matrixValue[y][x] !== -1) {
					if(matrixValue[idx][x] === -1){
						matrixValue[idx][x] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					} else if(matrixValue[idx][x] === matrixValue[y][x]) {
						scoreManager.addScore(matrixValue[idx][x]);
						matrixValue[idx++][x] *= 2;
						matrixValue[y][x] = -1;
					} else if(++idx !== y){
						matrixValue[idx][x] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					}
				}
			}
		}
	} else if(direction === DIRECTION.right) {
		for(y = 0; y < SIZE_Y; y++) {
			idx = SIZE_X - 1;
			console.log("X before:", matrixValue[y]);
			for(x = SIZE_X-2; x >= 0; x--) {
				if(matrixValue[y][x] !== -1) {
					if(matrixValue[y][idx] === -1){
						matrixValue[y][idx] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					} else if(matrixValue[y][idx] === matrixValue[y][x]) {
						scoreManager.addScore(matrixValue[y][idx]);
						matrixValue[y][idx--] *= 2;
						matrixValue[y][x] = -1;
					} else if(--idx !== x){
						matrixValue[y][idx] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					}
				}
			}
			console.log("X after:", matrixValue[y]);
			console.log("*****************************");
		}
	} else if(direction === DIRECTION.left) {
		for(y = 0; y < SIZE_Y; y++) {
			idx = 0;
			console.log("X before:", matrixValue[y]);
			for(x = 1; x < SIZE_X; x++) {
				if(matrixValue[y][x] !== -1) {
					if(matrixValue[y][idx] === -1){
						matrixValue[y][idx] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					} else if(matrixValue[y][idx] === matrixValue[y][x]) {
						scoreManager.addScore(matrixValue[y][idx]);
						matrixValue[y][idx++] *= 2;
						matrixValue[y][x] = -1;
					} else if(++idx !== x){
						matrixValue[y][idx] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					}
				}
			}
			console.log("X after:", matrixValue[y]);
			console.log("*****************************");
		}
	} else if(direction === DIRECTION.down) {
		for(x = 0; x < SIZE_X; x++) {
			idx = SIZE_Y - 1;
			for(y = SIZE_Y-2; y >= 0; y--) {
				if(matrixValue[y][x] !== -1) {
					if(matrixValue[idx][x] === -1){
						matrixValue[idx][x] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					} else if(matrixValue[idx][x] === matrixValue[y][x]) {
						scoreManager.addScore(matrixValue[idx][x]);
						matrixValue[idx--][x] *= 2;
						matrixValue[y][x] = -1;
					} else if(--idx !== y){
						matrixValue[idx][x] = matrixValue[y][x];
						matrixValue[y][x] = -1;
					}
				}
			}
		}
	}

	spawnRand();
	updateGridDisplay();
	
	scoreManager.updateBonusScore();
}



var maxValueDigitsIncreased = false;
var lastMaxValueDigits = 1;

function createScoreManager() {
	
	
	function getBest() {
		best = localStorage.getItem("2048best");
	}

	function setBest(n) {
		localStorage.setItem("2048best", n);
		best = n;
	}

	function updateBest() {
		if(best < (baseScore + bonusScore))
			setBest(baseScore + bonusScore);

		bestElem.innerHTML = best + "pts";
	}
	
	function initScore() {
		total_spawn = 0;
		baseScore = 0;
		bonusScore = 0;
		this.updateScore();
	}

	function initBest() {
		if(localStorage.getItem("2048best") === undefined) {
			setBest(0);
		}	
		getBest();
	}
	
	
	var baseScore = 0;
	var bonusScore = 0;
	
	var scoreElem = document.getElementById("p_score");

	var score_manager = new Object();
	
	score_manager.addScore = function(n) {
		var num = n;
		var score = 2;
		 n /= 2;
		 var idx = 1;
		while(n != 1) {
			if(idx++ %2 == 1) {
				score *= 2.5; 
			} else {
				score *= 2; 
			}
			n /= 2;
		}
		console.log("num %d, score:d.", num, score);
		baseScore += score;
	};
	
	score_manager.updateBonusScore = function() {
		var x, y, maxValue = 2;
		bonusScore = 0;
		for(y = 0; y < SIZE_Y; y++) {
			for(x = 0; x < SIZE_X; x++) {
				if(matrixValue[y][x] !== -1) {
					bonusScore += matrixValue[y][x];
					if(matrixValue[y][x] > maxValue) {
						maxValue = matrixValue[y][x];
					}
				}
			}
		}
		maxValue = "" + maxValue;
		if(maxValue.length > lastMaxValueDigits) {
			lastMaxValueDigits = maxValue.length;
			maxValueDigitsIncreased = true;
			updateDigitalFontSize();
		}
		currentSumLabel.innerHTML = bonusScore;
		this.updateScore();
	};
	
	score_manager.updateScore = function() {
		scoreElem.innerHTML = (baseScore + bonusScore) + "pts";
		updateBest();
		updateLevel();
	};
	
	
	score_manager.init = function() {
		initScore();
		initBest();
	};
	
	
	return score_manager;
}



// LEVEL FUNCTIONS
function getLevelText(lvl) {
	if(lvl === 1) // 4+
		return "Welcome newbie";
	else if(lvl === 2) // 16+
		return "Now you're playing";
	else if(lvl === 3) // 64+
		return "Keep calm and press up";
	else if(lvl === 4) // 256+
		return "That's okay for a first time I guess";
	else if(lvl === 5) // 1024+
		return "That's okay for a second time I guess";
	else if(lvl === 6) // 4,096+
		return "This is getting serious isn't it";
	else if(lvl === 7) // 16,384+
		return "Wow!";
	else if(lvl === 8) // 65,536+
		return "Can I have an autograph?";
	else if(lvl === 9) // 262,144+
		return "You're not supposed to see this, stop";
	else if(lvl === 10) // 1,048,576+
		return "I'm pretty sure it's illegal to use supercomputers for that";
	else
		return "";
}

function updateLevel() {
	level = Math.floor(Math.log(baseScore + bonusScore) / Math.log(4));

	if(level > 10)
		level = 10;
	if(level < 0)
		level = 0;

	var desc = getLevelText(level);

	levelText.innerHTML = "Level " + level + (desc === "" ? "" : (" — " + desc));
	levelBar.style.width = (level * 10) + "%";
}

// GAME OVER FUNCTIONS
function gameOver() {
	matrixGrid.setAttribute("class", "over");
	console.log("LOL");
}


// UTIL FUNCTIONS
function keyPress(code) {
	console.log("Key:", code);
	if(code === 37 || code === 74)
		moveGrid(DIRECTION.left); // left
	else if(code === 38 || code === 73)
		moveGrid(DIRECTION.up); // up
	else if(code === 39 || code === 76)
		moveGrid(DIRECTION.right); // right
	else if(code === 40 || code === 75)
		moveGrid(DIRECTION.down); // down
	else if(code === 13)
		initGame(); // reinit
}


function spawnRand() {
	var x, y, possibles = [];

	for(y = 0; y < SIZE_Y; y++) {
		for(x = 0; x < SIZE_X; x++) {
			if(matrixValue[y][x] === -1)
				possibles.push([x, y]);
		}
	}

	if(possibles.length) {
		for(var i=0; i<possibles.length/5; i++) {
			var randomValue = (Math.floor(Math.random() * 9) === 8 ? 4 : 2),
			randomBlock = possibles[(Math.floor(Math.random() * possibles.length))],
			x = randomBlock[0],
			y = randomBlock[1];
			matrixValue[y][x] = randomValue;
			total_spawn += randomValue;
		}
		ramdomSumLabel.innerHTML = total_spawn;
	} else {
		if(!checkMovable()) {
			gameOver();
		}
	}
}

function checkMovable() {
	for(y = 0; y < SIZE_Y; y++) {
		for(x = 0; x < SIZE_X; x++) {
			if((matrixValue[y + 1] !== undefined &&
					(matrixValue[y + 1][x] === matrixValue[y][x] || matrixValue[y + 1][x] == -1)) ||
				 (matrixValue[y][x + 1] !== undefined &&
				 	(matrixValue[y][x + 1] === matrixValue[y][x] || matrixValue[y][x + 1] == -1)) ||
				  matrixValue[y][x] == -1)
				return true;
		}
	}

	return false;
}


// INIT FUNCTIONS


function initMatrix() {
	matrixValue = new Array();
	for(var y = 0; y < SIZE_Y; y++) {
		matrixValue[y]=new Array();
		for(var x = 0; x < SIZE_X; x++){
			matrixValue[y][x] = -1;
		}
	}
}
function initGridMatrix() {
	initMatrix();
	spawnRand();
	spawnRand();
	updateGridDisplay();
}

function initGame() {
	matrixGrid.removeAttribute("class");
	scoreManager.init();
	
	initGridMatrix();
}


function updateDigitalFontSize() {
	if(maxValueDigitsIncreased) {
		//fontSize *= (lastMaxValueDigits-1)/lastMaxValueDigits;
		fontSize *= 0.8;
		 
		console.log("FontSize:", fontSize);
		var divs = matrixGrid.children;
		for(var i=0; i< divs.length; i++) {
			if(divs[i].nodeType == 1) {
				divs[i].style.fontSize = fontSize + "px";
			}
		}
		maxValueDigitsIncreased = false;
	}
		
}

function createGridElement() {
	if(matrixGrid.childNodes.length == SIZE_X * SIZE_Y) {
		console.log("grid is ready!");
		return;
	}
	var width =  matrixGrid.offsetWidth / SIZE_X;
	var height = matrixGrid.offsetHeight / SIZE_Y;
	//console.log(matrixGrid.width, matrixGrid.height);
	
	while(matrixGrid.firstChild) {
		matrixGrid.removeChild(matrixGrid.firstChild);
	}
	fontSize = width * 0.7;
	console.log("init font size:", fontSize);
	for(var y = 0; y < SIZE_Y; y++) {
		for(var x = 0; x < SIZE_X; x++) {
			var div_ele = document.createElement("div");
			div_ele.style.width = width * 0.957 + "px";
			div_ele.style.height = height * 0.957 + "px";
			div_ele.style.marginLeft = width * 0.03 + "px";
			div_ele.style.marginTop = height * 0.03 + "px";
			div_ele.style.fontSize = fontSize + "px";
			//console.log("grid width:%d, width:%d, total width:%d, height:%d,  div width:%s, height:%s, marginleft:%s, marginTop:%s", 
			//matrixGrid.offsetWidth, matrixGrid.offsetHeight, width, height, div_ele.style.width, div_ele.style.height, div_ele.style.marginLeft, div_ele.style.marginTop);
			matrixGrid.appendChild(div_ele);
		}
	}
	console.log("grid create success!");
}


function windowInit() {
	document.onkeydown = function(e) { keyPress(e.keyCode); }

	document.getElementById("try_again").onclick = initGame;

	document.getElementById("btn_ok").onclick = function() {
		SIZE_X = SIZE_Y = parseInt(document.getElementById("input_size").value);
		console.log(document.getElementById("input_size").value);
		console.log("size:%d.", SIZE_X);
		createGridElement();
		initGame();
		scoreManager.init();
	}
	elem_touch.getElementsByTagName("div")[0].onclick = function() { moveGrid(1); }
	elem_touch.getElementsByTagName("div")[1].onclick = function() { moveGrid(3); }
	elem_touch.getElementsByTagName("div")[2].onclick = function() { moveGrid(2); }
	elem_touch.getElementsByTagName("div")[3].onclick = function() { moveGrid(4); }

	createGridElement();
	initGame();
	scoreManager.init();
}

var scoreManager = createScoreManager();

windowInit();