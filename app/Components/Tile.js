import React from 'react';

export default function Tile({ tileState, handleMouseOver, inspectTile, index }) {
    return (
        <button
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={() => handleMouseOver(null)}
            onClick={() => inspectTile(index)}
            className="tile"
        >
            {tileState}
        </button>
    );
}