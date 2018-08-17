const React = require('react');
const PlayingTile = require('./PlayingTile');

function PlayingGridRow({ exploredTilesRow, rowNumber, markTileSafe, hoverOverTile }) {
  return (
    <ul className="row">
      {exploredTilesRow.map((exploredTileStatus, col) => (
        <PlayingTile
          key={`${rowNumber}-${col}`}
          exploredStatus={exploredTileStatus}
          handleClick={markTileSafe}
          row={rowNumber}
          col={col}
          handleMouseOver={hoverOverTile}
        />
      ))}
    </ul>
  );
}

function PlayingGrid({ exploredTilesMatrix, markTileSafe, hoverOverTile }) {
  return (
    <ul className="grid" id="mouseover-region">
      {exploredTilesMatrix.map((row, index) => (
        <li>
          <PlayingGridRow
            key={index}
            rowNumber={index}
            exploredTilesRow={row}
            markTileSafe={markTileSafe}
            hoverOverTile={hoverOverTile}
          />
        </li>
      ))}
    </ul>
  );
}

module.exports = PlayingGrid;
