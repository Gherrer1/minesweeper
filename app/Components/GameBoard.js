import React from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';
import _ from 'lodash';
import { getInitialState, checkIfPlayerWon, getNumSurroundingMines } from '../utils/boardHelpers';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    const { height, width } = props;

    this.state = getInitialState(height, width);

    this.currentlyMousedOver = null;

    this.resetGame = this.resetGame.bind(this);
    this.inspectTile = this.inspectTile.bind(this);
    this.updateMousedOver = this.updateMousedOver.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  resetGame() {
    const { height, width } = this.props;
    this.setState(getInitialState(height, width));
  }

  inspectTile(index) {
    const { playerWon, playerLost, tileStates, mineField } = this.state;
    if (playerWon || playerLost || tileStates[index] !== ' ') {
      return;
    }
    
    const newTileStates = [
      ...tileStates.slice(0, index),
      mineField[index] === true ? 'X' : getNumSurroundingMines(mineField, index, this.props.width),
      ...tileStates.slice(index + 1),
    ];

    // if its a mine, player lost
    if (mineField[index] === true) {
      return this.setState({
        tileStates: newTileStates,
        playerLost: true,
      });
    }

    return this.setState({
      tileStates: newTileStates,
      playerWon: checkIfPlayerWon(mineField, newTileStates),
    });
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
  }

  markTileAsMine(index) {
    
  }

  render() {
    const { tileStates, playerLost, playerWon } = this.state;

    return (
      <div>
          <Grid
            tiles={tileStates}
            hoverOverTile={this.updateMousedOver}
            inspectTile={this.inspectTile}
            // id="mouseover-region"
          />
          {playerLost && 'You lost'}
          {playerWon && 'You won'}
          <button onClick={this.resetGame}>New Game</button>
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

module.exports = GameBoard;
