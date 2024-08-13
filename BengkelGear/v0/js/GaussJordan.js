"use strict"

//dari chatgpt
let gaussJordan = (matrix, vector,)=>{
    // Check if matrix is square
    const n = matrix.length;
    if (n !== matrix[0].length) {
        throw new Error("Matrix must be square");
    }

    // Augment matrix with the vector
    const augmentedMatrix = [];
    for (let i = 0; i < n; i++) {
        augmentedMatrix.push([...matrix[i], vector[i]]);
    }

    // Apply Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
        // Make the diagonal element 1
        const divisor = augmentedMatrix[i][i];
        for (let j = 0; j <= n; j++) {
            augmentedMatrix[i][j] /= divisor;
        }

        // Make other elements in the current column 0
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = augmentedMatrix[k][i];
                for (let j = 0; j <= n; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }
    }

    // Extract the solution vector
    const solution = [];
    for (let i = 0; i < n; i++) {
        solution.push(augmentedMatrix[i][n]);
    }

    return solution;
}

//cara pakai
;{
// Example matrix and vector
const matrix = [
    [2, -1, 1],
    [-3, 3, -2],
    [1, 1, 1]
];
const vector = [4, -5, 2];

// Solve using Gauss-Jordan elimination
const solution = gaussJordan(matrix, vector);
console.log('\nCara pakai gaussJordan:')
console.log('\tmatrix',matrix,)
console.log('\tvector',vector,)
console.log("\tSolution:", solution); // Output: Solution: [ 1, 2, 1 ]

}