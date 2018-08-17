const React = require('react');
const PropTypes = require('prop-types');
const PlayingGrid = require('./PlayingGrid');
const _ = require('lodash');

/*
  Explored statuses:
  -1: unexplored
  0-8: marked as safe
  9: marked as mine
*/

/*
  Mine statuses:
  0-8: safe and show number of surrounding mines
  9: mine
*/

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyMousedOver: null,
      gameState: 'newgame',
      exploredTilesMatrix: GameBoard.getNewExploredTilesMatrix()
    };

    this.markTileSafe = this.markTileSafe.bind(this);
    this.updateMousedOver = this.updateMousedOver.bind(this);
    this.processKeyDown = this.processKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.processKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.processKeyDown);
  }

  processKeyDown(e) {
    // we only want to log the key if there's a non-null actively moused on.
    const keyPressed = e.key;
    if(this.state.currentlyMousedOver !== null) {
      console.log(`${keyPressed} was pressed while mousing over ${this.state.currentlyMousedOver}`);
    }
  }

  updateMousedOver(char) {
    this.setState({
      currentlyMousedOver: char
    });
  }

  markTileMine({ row, col }) {
    // TODO
  }

  // Assume that if it's marked as a mine, it's disabled
  markTileSafe({ row, col }) {
    const exploredTilesMatrix = this.state.exploredTilesMatrix;
    const mineTilesMatrix = this.state.mineTilesMatrix;

    if(this.state.gameState === 'newgame') {
      let mineTilesMatrix = GameBoard.getNewMineTilesMatrix({ row, col });
      let exploredTilesMatrixClone = _.cloneDeep(exploredTilesMatrix);
      exploredTilesMatrixClone[row][col] = mineTilesMatrix[row][col];

      return this.setState({
        gameState: 'ongoing',
        mineTilesMatrix: mineTilesMatrix,
        exploredTilesMatrix: exploredTilesMatrixClone
      });
    } else if(mineTilesMatrix[row][col] === 9 /* marked mine as safe*/) {
      return this.setState({
        gameState: 'lost', // TODO: revisit when working on LossGrid
      });
    } else if(mineTilesMatrix[row][col] < 9 /* marked safe as safe*/) {
      return this.setState(prevState => {
        let exploredTilesMatrixClone = _.cloneDeep(prevState.exploredTilesMatrix);
        exploredTilesMatrixClone[row][col] = prevState.mineTilesMatrix[row][col];
        return {
          exploredTilesMatrix: exploredTilesMatrixClone
        };
      });
      // TODO: check to see if we won after setting state
    } else {
      console.log('havent implemented yet');
    }
    // if mark mine as safe, return
    // what if we win?
    // what happens if we hover over disabled (safe) tile?
  }

  render() {
    return (
      <div>
        <div id="mouseover-region" onMouseLeave={() => this.updateMousedOver(null)} >
          {['a', 'b', 'c'].map(char => (
            <button
              key={char}
              onMouseOver={() => this.updateMousedOver(char)}
            >
              {char}
            </button>
          ))}
        </div>
        <p>Currently moused over: {this.state.currentlyMousedOver}</p>

        {this.state.gameState === 'ongoing' || this.state.gameState === 'newgame' ?
          <PlayingGrid exploredTilesMatrix={this.state.exploredTilesMatrix} markTileSafe={this.markTileSafe} />
          :
          this.state.gameState === 'lost' ?
          'Lost'
          :
          'Won'
        }
        {/* If game isnt over, show playingGrid
          <PlayingGrid
            exploredTilesMatrix={this.state.exploredTilesMatrix}
          />
        */}
        {/* If game IS over, show wonGrid or lostGrid */}
      </div>
    );
  }
}
GameBoard.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};
GameBoard.defaultProps = {
  width: 30,
  height: 16
};
GameBoard.getNewExploredTilesMatrix = function() {
  let matrix = [];
  for(let i = 0; i < 16; i++) {
    matrix[i] = new Array(30);
    for(let j = 0; j < 30; j++) {
      matrix[i][j] = -1;
    }
  }
  return matrix;
};
GameBoard.getNewMineTilesMatrix = function(firstClick) {
  let matrix = [];
  for(let i = 0; i < 16; i++) {
    matrix[i] = new Array(30);
    for(let j = 0; j < 30; j++) {
      matrix[i][j] = 0;
    }
  }

  GameBoard.randomlyAdd100Mines(matrix, firstClick);
  GameBoard.numberMarkMatrix(matrix);
  return matrix;
};
GameBoard.randomlyAdd100Mines = function(matrix, firstClick) {
  function createMine(matrix, firstClickX, firstClickY) {
    let xMax = matrix[0].length;
    let yMax = matrix.length;
    let mineX = Math.floor(Math.random() * xMax);
    let mineY = Math.floor(Math.random() * yMax);
    // if theres already a mine, dont add mine
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

  let numMines = 0;
  let firstClickX = firstClick.col;
  let firstClickY = firstClick.row;
  while(numMines < 100) { // configurable
    if(createMine(matrix, firstClickX, firstClickY)) {
      numMines++;
    }
  }
  return matrix;
};
GameBoard.numberMarkMatrix = function(matrix) {
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
};

module.exports = GameBoard;
