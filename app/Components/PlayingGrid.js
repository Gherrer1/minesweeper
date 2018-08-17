const React = require('react');
const PlayingTile = require('./PlayingTile');

function PlayingGridRow({ exploredTilesRow, rowNumber, markTileSafe }) {
  return (
    <ul className="row">
      {exploredTilesRow.map((exploredTileStatus, col) => (
        <PlayingTile
          key={`${rowNumber}-${col}`}
          exploredStatus={exploredTileStatus}
          handleClick={markTileSafe}
          row={rowNumber}
          col={col}
        />
      ))}
    </ul>
  );
}

function PlayingGrid({ exploredTilesMatrix, markTileSafe }) {
  return (
    <ul className="grid">
      {exploredTilesMatrix.map((row, index) => (
        <PlayingGridRow
          key={index}
          rowNumber={index}
          exploredTilesRow={row}
          markTileSafe={markTileSafe}
        />
      ))}
    </ul>
  );
}

module.exports = PlayingGrid;
