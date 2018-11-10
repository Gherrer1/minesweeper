import React from 'react';
import Tile from './Tile';

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

function PlayingGrid({ tiles, markTileSafe, hoverOverTile }) {
  return (
    <div className="grid" id="mouseover-region">
      {tiles.map((tileState, index) => (
        <Tile key={index} tileState={tileState} />
      ))}
    </div>
  );
}

module.exports = PlayingGrid;
