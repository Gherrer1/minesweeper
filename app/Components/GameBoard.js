const React = require('react');
const PropTypes = require('prop-types');
const PlayingTile = require('./PlayingTile');

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyMousedOver: null
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
        <ul className="row">
          <PlayingTile mineStatus={5} exploredStatus={1} />
          <PlayingTile mineStatus={5} exploredStatus={-1} />
          <PlayingTile mineStatus={9} exploredStatus={-1} />
          <PlayingTile mineStatus={9} exploredStatus={1} />
          <PlayingTile mineStatus={5} exploredStatus={0} />
          <PlayingTile mineStatus={9} exploredStatus={0} />
        </ul>
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
