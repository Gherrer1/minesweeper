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
    return {
        gameInProgress: false,
        playerLost: false,
        playerWon: false,
        mineField: getMineField(height, width, 50),
        tileStates: initTileStates(height, width),
    };
}
