const React = require('react');

function NewGameButton(props) {
  return (
    <button onClick={props.handleClick} >New Game</button>
  );
}

module.exports = NewGameButton;
