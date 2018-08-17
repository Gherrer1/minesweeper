const React = require('react');
const GameBoard = require('./GameBoard');

class App extends React.Component {
  render() {
    return (
      <GameBoard width={10} height={10} />
    );
  }
}

module.exports = App;
