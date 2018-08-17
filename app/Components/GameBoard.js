const React = require('react');
const PropTypes = require('prop-types');
const PlayingGrid = require('./PlayingGrid');

/*
  Explored statuses:
  -1: unexplored
  0-8: marked as safe
  9: marked as mine
*/

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyMousedOver: null,
      gameState: 'newgame',
      exploredTilesMatrix: this.getNewExploredTilesMatrix()
    };

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

  getNewExploredTilesMatrix() {
    let matrix = [];
    for(let i = 0; i < 16; i++) {
      matrix[i] = new Array(30);
      for(let j = 0; j < 30; j++) {
        matrix[i][j] = -1;
      }
    }
    return matrix;
  }

  updateMousedOver(char) {
    this.setState({
      currentlyMousedOver: char
    });
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
          <PlayingGrid exploredTilesMatrix={this.state.exploredTilesMatrix} />
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

module.exports = GameBoard;
