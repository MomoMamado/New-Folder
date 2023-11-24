const boardLenght = 10;
const boardWidth = 10;
const boardDifficulty = 2;

let container = document.getElementById('buscanimas-container');
let gameOver = false;
let board;

class Space {
    constructor(xPos, yPos, hidden) {
      this.xPos = xPos;
      this.yPos = yPos;
      this.state = 'unknown';
      this.hidden = hidden;
      this.number = null;
    }
}

class Board {
    constructor(width, lenght, difficulty) {
        this.space = [];
        for (let index = 0; index < width; index++) {
            this.space[index] = [];
            for (let indey = 0; indey < lenght; indey++) {
                this.space[index][indey] = new Space(index, indey, difficulty >= (Math.random() * 10));
            }
        }

        for (let index = 0; index < width; index++) {
            for (let indey = 0; indey < lenght; indey++) {
                let minesAround = 0;
                for (let xdif = -1; xdif <= 1; xdif++) {
                    for (let ydif = -1; ydif <= 1; ydif++) {
                        if(this.space[index + xdif] != null) if(this.space[index + xdif][indey + ydif] != null) if(this.space[index + xdif][indey + ydif].hidden){
                            minesAround++;
                        }
                    }
                }       


                this.space[index][indey].number = minesAround;
            }
        }        
    }
}



function lose(lastSpace){
    document.getElementById('lostScreen').toggleAttribute('hidden');
    gameOver = true;
    let explosionImage = document.createElement('img');
    explosionImage.src = './img/perdiste.jpg';
    explosionImage.alt = 'Nimas getting blown up by Callejas';
    lastSpace.append(explosionImage);
}

function win(){
    document.getElementById('wonScreen').toggleAttribute('hidden');
    gameOver = true;
}

function checkWin(){
    let freeRemaining = 0;
    board.space.forEach(column => {
        column.forEach(space => {
            if ((space.state == 'unknown' && !space.hidden)){
                freeRemaining++;
            } 
        });
    });
    return freeRemaining;
}

function buildBoard(){
    board = new Board(boardLenght, boardWidth, boardDifficulty);
    board.space.forEach(column => {
        column.forEach(space => {
            
            let spaceDiv = document.createElement('div');
            spaceDiv.setAttribute('xpos', space.xPos);
            spaceDiv.setAttribute('ypos', space.yPos);
            spaceDiv.addEventListener('click', function (e){
                if (gameOver) return;
                if (e.target.hasAttribute('known')) return;
                if (e.target.hasAttribute('marked')) return;

                e.target.toggleAttribute('known');
                space.state = 'known';
                
                let xpos = parseInt(e.target.getAttribute('xpos'));
                let ypos = parseInt(e.target.getAttribute('ypos'));
                
                
                if (board.space[xpos][ypos].hidden == true) {
                    lose(e.target);
                } else {
                    e.target.innerText = board.space[xpos][ypos].number;
                }
                
                if(checkWin() == 0) {
                    win();
                }
            });
            spaceDiv.addEventListener('contextmenu', function (e){
                if (gameOver) return;
                e.preventDefault();
                e.target.toggleAttribute('marked');
            });
            container.append(spaceDiv);
        });
    });
}

buildBoard();