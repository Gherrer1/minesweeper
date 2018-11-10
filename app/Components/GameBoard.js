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

    return this.setState(prevState => ({
      tileStates: newTileStates,
      safeTilesLeft: prevState.safeTilesLeft - 1,
      playerWon: prevState.safeTilesLeft === 1,
    }));
  }

  handleKeyDown(e) {
    const keyPressed = e.key;
    if(keyPressed !== ' ' || typeof this.currentlyMousedOver !== 'number') return;

    const { playerWon, playerLost, tileStates } = this.state;
    if (playerWon || playerLost || typeof tileStates[this.currentlyMousedOver] === 'number' ) return;

    // only allowed to mark an uncovered tile or a potential mine tile
    const newTileStates = [
      ...tileStates.slice(0, this.currentlyMousedOver),
      tileStates[this.currentlyMousedOver] === ' ' ? 'm' : ' ',
      ...tileStates.slice(this.currentlyMousedOver + 1),
    ];

    this.setState({
      tileStates: newTileStates,
    });
  }

  updateMousedOver(index) {
    this.currentlyMousedOver = index;
  }

  render() {
    const { tileStates, playerLost, playerWon, safeTilesLeft } = this.state;

    return (
      <div>
          <p>{safeTilesLeft} Safe Tiles Left</p>
          <Grid
            tiles={tileStates}
            hoverOverTile={this.updateMousedOver}
            inspectTile={this.inspectTile}
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
