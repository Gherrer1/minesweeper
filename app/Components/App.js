const React = require('react');
const GameBoard = require('./GameBoard');

class App extends React.Component {
  render() {
    return (
      <GameBoard />
    );
  }
}

module.exports = App;
