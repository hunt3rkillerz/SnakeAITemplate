class snakePiece{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

class Game {
	constructor(width, height, controller) {
		this.controller = controller;
		this.freeCells = width * height;
		this.canvas = document.getElementById('tableBody');
		this.board = new Array(width);
		// Will act as a queue
		this.snake = [];
		for(let i = 0; i < this.board.length; i++)
		{
			this.board[i] = new Array(height);
		}
		this.setupGameBoard();
	}
	
	allocateApple()
	{
		// Todo, make this less stupid
		while(true){
			let x = Math.floor(Math.random() * this.board.length);
			let y = Math.floor(Math.random() * this.board[0].length);
			if(this.board[x][y] == blank)
			{
				this.board[x][y] = food;
				return
			}
		}
	}
	
	setupGameBoard()
	{
		// Set all cells to blank
		for(let i = 0; i < this.board.length; i++)
		{
			for(let j = 0; j < this.board[i].length; j++)
			{
				this.board[i][j] = blank;
			}			
		}
		const midX = this.board.length / 2;
		const midY = this.board.length / 2;
		this.board[midX][midY] = snakeHead;
		this.board[midX][midY-1] = snakeTail;
		
		// Add snake pieces to queue
		this.snake.push(new snakePiece(midX, midY-1));
		this.snake.push(new snakePiece(midX, midY));
		
		
		this.allocateApple();
	}
	
	draw()
	{
		const heightStr = 100 / this.board[0].length;
		let boardStr = "<table style='width: 100%; height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0;border:1px solid'>"
		for(let i = 0; i < this.board.length; i++)
		{
			boardStr += "<tr style='width: 100%; height: "+heightStr+"%'>";
			for(let j = 0; j < this.board[i].length; j++)
			{
				switch(this.board[i][j])
				{
					case blank:
						boardStr += "<td style='background: black;'></td>"
						break;
					case food:
						boardStr += "<td style='background: red'></td>"
						break;
					case snakeHead:
						boardStr += "<td style='background: yellow'></td>"
						break;
					case snakeTail:
						boardStr += "<td style='background: brown'></td>"
						break;
					case snakeBody:
						boardStr += "<td style='background: green'></td>"
						break;
				}
			}
			boardStr += "</tr>";
		}
		boardStr += "</table>"
		this.canvas.innerHTML = boardStr;
	}
	
	updatePositions()
	{
		//Get movement direction
		let direction = this.controller.makeDecision(this.board);
		// Check What Happens
		
		
		// Check new piece location
		let oldHead = this.snake[this.snake.length-1];
		let locX = 0;
		let locY = 0;
		switch(direction)
		{
			case nothing:
				return true;
				break;
			case down:
				locX = oldHead.x  + 1;
				locY = oldHead.y;
				break;
			case up:
				locX = oldHead.x - 1;
				locY = oldHead.y;
				break;
			case left:
				locX = oldHead.x;
				locY = oldHead.y - 1;
				break;
			case right:
				locX = oldHead.x;
				locY = oldHead.y + 1;
				break;
		}
		if (locX >= this.board.length || locX < 0 || locY >= this.board[0].length || locY < 0)
		{
			return true;
		}
		
		// TODO check move is within game boundaries
		
		
		// Check for collision
		if(this.board[locX][locY] == snakeBody)
		{
			// Snake cannot run into it's head or tail
			// Game over 
			return false;
		}
		
		// Redraw snake head
		this.board[oldHead.x][oldHead.y] = snakeBody;
		
		this.snake.push(new snakePiece(locX, locY))
		
		
		// Check for apples
		if(this.board[locX][locY] == food)
		{
			// Add new apple
			this.allocateApple();
		}
		else
		{
			//Kill tail
			const deadPiece = this.snake.shift();
			this.board[deadPiece.x][deadPiece.y] = blank;
			
			//Update tail
			const newTail = this.snake[0];
			this.board[newTail.x][newTail.y] = snakeTail;
		}
		
		this.board[locX][locY] = snakeHead;
		return true;
	}
	sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
	async gameLoop()
	{
		while(true)
		{
			// Update GameState
			if(!this.updatePositions())
			{
				alert("Game Over");
				return
			}
			// Draw
			this.draw();
			await this.sleep(200)
		}
	}
}

let controller = new humanController();
let game = new Game(20, 20, controller);
game.gameLoop();