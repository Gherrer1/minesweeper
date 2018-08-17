const React = require('react');
const PlayingTile = require('./PlayingTile');

function PlayingGridRow({ exploredTilesRow, rowNumber }) {
  return (
    <ul className="row">
      {exploredTilesRow.map((exploredTileStatus, col) => (
        <PlayingTile key={`${rowNumber}-${col}`} exploredStatus={exploredTileStatus} />
      ))}
    </ul>
  );
}

function PlayingGrid({ exploredTilesMatrix }) {
  return (
    <ul className="grid">
      {exploredTilesMatrix.map((row, index) => (
        <PlayingGridRow key={index} rowNumber={index} exploredTilesRow={row} />
      ))}
    </ul>
  );
}

module.exports = PlayingGrid;
