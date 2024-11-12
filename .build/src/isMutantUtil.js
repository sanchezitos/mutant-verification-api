"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Función principal que determina si una secuencia de ADN es mutante
function isMutantUtil(dna) {
    const N = dna.length;
    const sequenceLength = 4;
    let count = 0;
    // Función para verificar si hay una secuencia de 4 caracteres iguales en una dirección específica
    function hasSequence(x, y, dx, dy) {
        const base = dna[x][y];
        for (let i = 1; i < sequenceLength; i++) {
            const newX = x + i * dx;
            const newY = y + i * dy;
            if (newX >= N || newY >= N || dna[newX][newY] !== base) {
                return false;
            }
        }
        return true;
    }
    // Recorremos cada posición de la matriz
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            // Comprobamos en las 4 direcciones posibles desde cada posición
            if (hasSequence(i, j, 1, 0) || // Vertical
                hasSequence(i, j, 0, 1) || // Horizontal
                hasSequence(i, j, 1, 1) || // Diagonal hacia abajo-derecha
                hasSequence(i, j, 1, -1) // Diagonal hacia abajo-izquierda
            ) {
                count++;
                // Si encontramos 2 o más secuencias, es mutante
                if (count >= 2)
                    return true;
            }
        }
    }
    return false;
}
exports.default = isMutantUtil;
