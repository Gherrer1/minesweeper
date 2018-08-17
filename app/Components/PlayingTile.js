const React = require('react');

/*
  Explored statuses:
  -1: unexplored
  0-8: marked as safe
  9: marked as mine
*/

/* The assumption is that this type of tile only renders on a PlayingGrid, meaning the game is not over yet if this is rendering. */
function PlayingTile({ exploredStatus, handleClick, row, col, handleMouseOver }) {
  return (
    <li>
      <button
        className='tile'
        disabled={exploredStatus >= 0 && exploredStatus <= 8}
        onClick={() => handleClick({ row, col })}
        onMouseOver={() => handleMouseOver({ row, col })}
      >
        { exploredStatus === -1 ?
            ' '
            :
            exploredStatus < 9 ?
              exploredStatus
              :
              'M'
        }
      </button>
    </li>
  );
}

module.exports = PlayingTile;
