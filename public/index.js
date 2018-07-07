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


(function() {
  let matrix = getMatrix();
  initGame(matrix, 10, 10);
  // add buttons
  const app = document.getElementById("app");
  console.log(app);
  matrix.forEach(row => {
      let rowDiv = document.createElement("div");
      row.forEach(colNum => {
        let button = document.createElement("button");
        button.setAttribute('class', 'cell');
        button.innerHTML = colNum;
        rowDiv.appendChild(button);
      });
      app.appendChild(rowDiv);
  });

})();
