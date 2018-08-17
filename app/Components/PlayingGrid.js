const React = require('react');
const PlayingTile = require('./PlayingTile');

function PlayingGridRow({ exploredTilesRow, rowNumber, markTile }) {
  return (
    <ul className="row">
      {exploredTilesRow.map((exploredTileStatus, col) => (
        <PlayingTile
          key={`${rowNumber}-${col}`}
          exploredStatus={exploredTileStatus}
          handleClick={markTile}
          row={rowNumber}
          col={col}
        />
      ))}
    </ul>
  );
}

function PlayingGrid({ exploredTilesMatrix, markTile }) {
  return (
    <ul className="grid">
      {exploredTilesMatrix.map((row, index) => (
        <PlayingGridRow
          key={index}
          rowNumber={index}
          exploredTilesRow={row}
          markTile={markTile}
        />
      ))}
    </ul>
  );
}

module.exports = PlayingGrid;
