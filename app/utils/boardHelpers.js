function getMineField(height, width, numMines = 100) {
    let numTiles = height * width;
    const grid = (new Array(numTiles)).fill(false);
    while (numMines > 0) {
        const mineIndex = Math.floor(Math.random() * numTiles);
        if (!grid[mineIndex]) {
            grid[mineIndex] = true;
            numMines--;
        }
    }
    return grid;
}

function initTileStates(height, width) {
    return (new Array(height * width)).fill(' ');
}

export function getInitialState(height, width) {
    const maxNumberOfMines = Math.min( Math.floor(height*width * .21), 100 );
    return {
        gameInProgress: false,
        playerLost: false,
        playerWon: false,
        mineField: getMineField(height, width, maxNumberOfMines),
        tileStates: initTileStates(height, width),
        safeTilesLeft: height*width - maxNumberOfMines,
    };
}

export function checkIfPlayerWon(mineField, tileStates) {
    // a player won if all non mine tiles are uncovered
    for(let i = 0; i < mineField.length; i++) {
        if (mineField[i] === false && tileStates[i] === ' ') {
            return false;
        }
    }

    return true;
}

export function getNumSurroundingMines(mineField, index, width) {
    let numSurroundingMines = 0;
    // above
    if (index - width > -1) {
        if(mineField[index - width] === true)
            numSurroundingMines++;

        // top corners
        if ( (index % width) + 1 < width) {
            if(mineField[index - width + 1] === true)
                numSurroundingMines++;
        }
        if ( (index % width) - 1 > -1) {
            if(mineField[index - width - 1] === true)
                numSurroundingMines++;
        }
    }
    // below
    if (index + width < mineField.length) {
        if(mineField[index + width] === true)
            numSurroundingMines++;

        // bottom corners
        if ( (index % width) + 1 < width) {
            if(mineField[index + width + 1] === true)
                numSurroundingMines++;
        }
        if ( (index % width) - 1 > -1) {
            if(mineField[index + width - 1] === true)
                numSurroundingMines++;
        }
    }
    // right
    if ( (index % width) + 1 < width) {
        if(mineField[index + 1] === true)
            numSurroundingMines++;
    }
    // left
    if ( (index % width) - 1 > -1) {
        if(mineField[index - 1] === true)
            numSurroundingMines++;
    }

    return numSurroundingMines;
}
