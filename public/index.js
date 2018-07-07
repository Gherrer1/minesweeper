function getMatrix(rows = 16, cols = 30) {
  let matrix = [];
  for(let i = 0; i < rows; i++) {
    matrix[i] = new Array(cols);
    for(let j = 0; j < cols; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

// when user clicks, we get a 3x3 restricted zone centered at the click site. if user clicks at the edge, it's fine, that 3x3 just gets cut off
// returns true if mine added, false if mine not added
function createMine(matrix, firstClickX, firstClickY) {
  let xMax = matrix[0].length;
  let yMax = matrix.length;
  let mineX = getRandomNumber(xMax);
  let mineY = getRandomNumber(yMax);
  // if theres already a mine there, dont add mine
  if(matrix[mineY][mineX] !== 0) {
    return false;
  }
  // if random spot falls in the 3x3 initial restricted zone, dont add mine
  if(mineX >= firstClickX - 1 &&  mineX <= firstClickX + 1 && mineY >= firstClickY - 1 && mineY <= firstClickY + 1) {
    return false;
  }
  matrix[mineY][mineX] = 9;
  return true;
}

function numberMarkMatrix(matrix) {
  for(let r = 0; r < matrix.length; r++) {
    for(let c = 0; c < matrix[0].length; c++) {
      // if its a mine, no need to count. Continue.
      if(matrix[r][c] === 9) continue;

      let numSurroundingMines = 0;
      for(let xd = -1; xd <= 1; xd++) {
        for(let yd = -1; yd <= 1; yd++) {
          if(r + yd >= 0 && r + yd < matrix.length && c + xd >= 0 && c + xd < matrix[0].length && matrix[r + yd][c + xd] === 9) {
            numSurroundingMines++;
          }
        }
      }
      matrix[r][c] = numSurroundingMines;
    }
  }
}

function initGame(matrix, firstClickX, firstClickY, maxNumMines = 100) {
  let numMines = 0;
  while(numMines < maxNumMines) {
    if(createMine(matrix, firstClickX, firstClickY)) {
      numMines++;
    }
  }
  numberMarkMatrix(matrix);
}

function handleCellClick() {
  let btn = this;
  let btnClass = btn.className;
  let coordinates = btnClass.split(' ')[0].split('_').map(coordinateStr => Number(coordinateStr));
  console.log(coordinates);
}

function getFreshNewGrid(rows = 16, cols = 30) {
  const gridDiv = document.createElement('div');
  gridDiv.id = 'grid-div';

  for(let i = 0; i < rows; i++) {
    let rowDiv = document.createElement('div');
    rowDiv.setAttribute('class', 'gridRow');

    for(let j = 0; j < cols; j++) {
      let button = document.createElement('button');
      button.setAttribute('class', `${i}_${j} cell`);
      button.addEventListener('click', handleCellClick);
      // button.innerHTML = colNum;
      rowDiv.appendChild(button);
    }
    gridDiv.appendChild(rowDiv);
  }
  return gridDiv;
}


(function() {
  let ROWS = 16;
  let COLS = 30;
  let matrix = getMatrix(ROWS, COLS);
  // instead what we should do is we should treat the matrix like a model
  // and fill the page with like a grid and give each cell an id indicating its coordinates

  // alternative to getFreshNewGrid: only add grid to DOM once, and upon new game, just reset classes so that the grid looks untouched
  // because at the end of the day, the most important part of starting a new game is getting a fresh matrix that will be represented
  // by the grid. The grid itself is merely the face of the matrix. There's no need to create a new one each time.
  // however, I already wrote the code, and it's only 30x16 cells anyway, so I'll stick with it.
  // Just know that I considered the (smarter tbh) alternative
  let gridDomElement = getFreshNewGrid(ROWS, COLS);
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild( gridDomElement );

  // initGame(matrix, 10, 10);
  // add buttons
  console.log(app);

})();
