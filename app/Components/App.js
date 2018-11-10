const React = require('react');
const GameBoard = require('./GameBoard');

class App extends React.Component {
  render() {
    return (
      <GameBoard width={5} height={5} />
    );
  }
}

module.exports = App;
