import React from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';
import _ from 'lodash';
import { getMineField, initTileStates } from '../utils/boardHelpers';

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

    const { height, width } = props;

    this.state = {
      gameInProgress: false,
      playerLost: false,
      playerWon: false,
      mineField: getMineField(height, width, 50),
      tileStates: initTileStates(height, width),
    };

    this.currentlyMousedOver = null;

    this.markTileSafe = this.markTileSafe.bind(this);
    this.updateMousedOver = this.updateMousedOver.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    const keyPressed = e.key;
    if(keyPressed !== ' ') return;
    this.setState(prevState => {
      if(this.currentlyMousedOver === null)
        return {};
      let { row, col } = this.currentlyMousedOver;
      if(GameBoard.isTileMarkedSafe(prevState.exploredTilesMatrix[row][col]))
        return {};
      // hovered tile isnt marked safe, so toggle between unexplored and mine
      let exploredTilesMatrixClone = _.cloneDeep(prevState.exploredTilesMatrix);
      exploredTilesMatrixClone[row][col] = exploredTilesMatrixClone[row][col] === -1 ? 9 : -1;
      return {
        exploredTilesMatrix: exploredTilesMatrixClone
      };
    })
    // WARNING: I'm guessing we'll still be able to click on mines. That shouldnt happen
  }

  updateMousedOver(index) {
    this.currentlyMousedOver = index;
    console.log(index);
  }

  markTileMine({ row, col }) {
    // TODO
  }

  markTileSafe({ row, col }) {
    // this.setState(prevState => {
    const exploredTilesMatrix = this.state.exploredTilesMatrix;
    const mineTilesMatrix = this.state.mineTilesMatrix;

    if(this.state.gameState === 'newgame') {
      let mineTilesMatrix = GameBoard.getNewMineTilesMatrix({ row, col }, { rows: this.props.height, cols: this.props.width });
      let exploredTilesMatrixClone = _.cloneDeep(exploredTilesMatrix);
      exploredTilesMatrixClone[row][col] = mineTilesMatrix[row][col];

      return this.setState({
        gameState: 'ongoing',
        mineTilesMatrix: mineTilesMatrix,
        exploredTilesMatrix: exploredTilesMatrixClone
      });
    } else if(exploredTilesMatrix[row][col] === 9 /* tile is already marked as mine */) {
      console.log('not doing anything, this tiles already a mine');
      return;
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
      }, function cb() {
        if(GameBoard.gameWon(this.state.mineTilesMatrix, this.state.exploredTilesMatrix)) {
          this.setState({
            gameState: 'won'
          });
        }
      });
    } else {
      console.log('havent implemented yet');
    }
    // });
    // if mark mine as safe, return
    // what happens if we hover over disabled (safe) tile?
    // WARNING: if we hover over a disabled tile, the last non disabled tile will stil be stored. It seems like we might need a leave event for each tile
  }

  render() {
    const { tileStates } = this.state;

    return (
      <div>
          <Grid
            tiles={tileStates}
            hoverOverTile={this.updateMousedOver}
            // markTileSafe={this.markTileSafe}
            // id="mouseover-region"
          />
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

GameBoard.getNewMineTilesMatrix = function(firstClick, dims) {
  let matrix = [];
  for(let i = 0; i < dims.rows; i++) {
    matrix[i] = new Array(dims.cols);
    for(let j = 0; j < dims.cols; j++) {
      matrix[i][j] = 0;
    }
  }

  GameBoard.randomlyAddMines(matrix, firstClick);
  GameBoard.numberMarkMatrix(matrix);
  return matrix;
};
GameBoard.randomlyAddMines = function(matrix, firstClick) {
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
  // TODO: rework this formula. Its good enough for now though
  let MAX_NUM_MINES = Math.floor(.20 * matrix.length * matrix[0].length);
  let firstClickX = firstClick.col;
  let firstClickY = firstClick.row;
  while(numMines < MAX_NUM_MINES) {
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
GameBoard.gameWon = function(mineTilesMatrix, exploredTilesMatrix) {
  for(var i = 0; i < mineTilesMatrix.length; i++) {
    for(var j = 0; j < mineTilesMatrix[0].length; j++) {
      if(mineTilesMatrix[i][j] < 9 && (exploredTilesMatrix[i][j] < 0 || exploredTilesMatrix[i][j] > 8)) {
        return false;
      }
    }
  }

  return true;
};
GameBoard.isTileMarkedSafe = function(tileExploredStatus) {
  return (tileExploredStatus >= 0 && tileExploredStatus <= 8);
}

module.exports = GameBoard;
