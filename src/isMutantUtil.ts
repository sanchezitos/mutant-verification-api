export type DNA = string[];

export default function isMutantUtil(dna: DNA): boolean {
    const N = dna.length;
    const sequenceLength = 4;
    let count = 0;

    function hasSequence(x: number, y: number, dx: number, dy: number): boolean {
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

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (
                hasSequence(i, j, 1, 0) || 
                hasSequence(i, j, 0, 1) || 
                hasSequence(i, j, 1, 1) || 
                hasSequence(i, j, 1, -1)   
            ) {
                count++;
                if (count >= 2) return true;
            }
        }
    }
    return false;
}

