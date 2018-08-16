const React = require('react');
const PropTypes = require('prop-types');

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyMousedOver: null
    };

    this.updateMousedOver = this.updateMousedOver.bind(this);
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
