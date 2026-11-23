const lifeworld = {

    init(numCols, numRows) {
        this.numCols = numCols;
        this.numRows = numRows;
        this.world = this.buildArray();
        this.worldBuffer = this.world;
        this.randomSetup();
    },

    buildArray() {
        let outerArray = [];
        for (let row = 0; row < this.numRows; row++) {
            let innerArray = [];
            for (let col = 0; col < this.numCols; col++) {
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.world[row][col] = 0;
                if (Math.random() < .1) {
                    this.world[row][col] = 1;
                }
            }
        }
    },

    getLivingNeighbors(row, col) {
        // Weed out cells on the edges of the grid
        if (row <= 0 || col <= 0) return 0;
        if (row >= this.world.length - 1 || col >= this.world[0].length - 1) return 0;

        // Count up living neighboring cells
        let neighborCount = 0;
        if (this.world[row - 1][col - 1] == 1) neighborCount++;
        if (this.world[row - 1][col] == 1) neighborCount++;
        if (this.world[row - 1][col + 1] == 1) neighborCount++;
        if (this.world[row][col - 1] == 1) neighborCount++;
        if (this.world[row][col + 1] == 1) neighborCount++;
        if (this.world[row + 1][col - 1] == 1) neighborCount++;
        if (this.world[row + 1][col] == 1) neighborCount++;
        if (this.world[row + 1][col + 1] == 1) neighborCount++;
        // return number
        return neighborCount;
    },

    step() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                // get number of living neightbors of current cell
                let livingNeighbors = this.getLivingNeighbors(row, col);

                // store whether the cell is currently alive
                let currentlyAlive = false;
                if (this.world[row][col] == 1) currentlyAlive = true;

                // determine if this cell should be alive in the next generation
                let aliveNextGeneration = false;
                // Since bool is automatically set to false, only need to check
                // for cases where it will be true.
                if (currentlyAlive && livingNeighbors >= 2 && livingNeighbors <= 3) aliveNextGeneration = true;
                if (!currentlyAlive && livingNeighbors == 3) aliveNextGeneration = true;

                // Put a 1 or zero into the right location in this.worldBuffer
                if (aliveNextGeneration) this.worldBuffer[row][col] = 1;
                else this.worldBuffer[row][col] = 0;
            }
        }

        // When looping is done, swap .world and .worldBuffer
        let temp = this.worldBuffer;
        this.worldBuffer = this.world;
        this.world = temp;
    }
} // end lifeworld literal