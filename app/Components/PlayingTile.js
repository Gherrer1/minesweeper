const React = require('react');

// Explored Statuses:
// -1 marked mine
//  0 unexplored
//  1 marked safe

// MineStatuses
// [0-8]: safe square w/ number = num surrounding tiles
//     9: mine tile

/* The assumption is that this type of tile only renders on a PlayingGrid, meaning the game is not over yet if this is rendering. */
function PlayingTile({ mineStatus, exploredStatus }) {
  return (
    <li>
      <button className='tile'>
        { exploredStatus === 0 ?
            ' '
            :
            exploredStatus === 1 ?
              mineStatus
              :
              'M'
        }
      </button>
    </li>
  );
}

module.exports = PlayingTile;
