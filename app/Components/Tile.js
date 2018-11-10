import React from 'react';

export default function Tile({ tileState, handleMouseOver, index }) {
    return (
        <button
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={() => handleMouseOver(null)}
        >
            {tileState}
        </button>
    );
}