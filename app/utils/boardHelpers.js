export function getMineField(height, width, numMines = 100) {
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

// -1 = mine
// 0-8 = showing num mines surrounding it
// 9 = covered
export function initTileStates(height, width) {
    return (new Array(height * width)).fill(9);
}
