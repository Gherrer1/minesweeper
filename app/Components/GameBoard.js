const React = require('react');
const PropTypes = require('prop-types');

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mineMatrix: GameBoard.getMineMatrix({
        width: props.width,
        height: props.height
      }),
      exploredTilesMatrix: GameBoard.getFreshGrid({
        width: props.width,
        height: props.height
      })
    };
  }

  componentDidMount() {
    console.log(this.state);
  }

  render() {
    return (
      <div>
        {/* if game not over, show uncovered tiles and covered tiles */}
        {/* if game is over, show uncovered board */}
        {this.state.exploredTilesMatrix.map((row, index) => (
          <div key={index}>
            {row.map((col, jndex) => (
              <button key={jndex}>
                {this.state.exploredTilesMatrix[index][jndex] ? 1 : 0}
              </button>
            ))}
          </div>
        ))}
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

GameBoard.getMineMatrix = function({ width, height }) {
  let matrix = [];
  for(let i = 0; i < height; i++) {
    matrix[i] = new Array(width);
    for(let j = 0; j < width; j++) {
      matrix[i][j] = 0;
    }
  }

  return matrix;
}
GameBoard.getFreshGrid = function({ width, height }) {
  let matrix = [];
  for(let i = 0; i < height; i++) {
    matrix[i] = new Array(width);
    for(let j = 0; j < width; j++) {
      matrix[i][j] = false;
    }
  }

  return matrix;
}

module.exports = GameBoard;
