import { ILandscape } from "@/interfaces/ILandscape";
import { HSLtoLandscape, PercentageToHSL } from "./colors";

function randomInRange(min: number = -1, max: number = 1): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateMatrix(size: number, randomFactor: number = 1): number[][] {
  const n = Math.pow(2, size) + 1;
  const matrix = new Array(n).fill(0).map(() => new Array(n).fill(null));

  matrix[0][n - 1] = randomInRange(0, randomFactor);
  matrix[n - 1][0] = randomInRange(0, randomFactor);
  matrix[0][0] = randomInRange(0, randomFactor);
  matrix[n - 1][n - 1] = randomInRange(0, randomFactor);

  return matrix;
}

function calculateSquare(matrix: number[][], chunkSize: number, randomFactor: number = 1): void {
  for (let i = 0; i < matrix.length - 1; i += chunkSize) {
    for (let j = 0; j < matrix.length - 1; j += chunkSize) {
      const bottomRight = matrix[j + chunkSize]
        ? matrix[j + chunkSize][i + chunkSize]
        : null;
      const bottomLeft = matrix[j + chunkSize]
        ? matrix[j + chunkSize][i]
        : null;
      const topLeft = matrix[j][i];
      const topRight = matrix[j][i + chunkSize];
      const square = [bottomRight, bottomLeft, topLeft, topRight];
      const { count, sum } = square.reduce(function (result, value: number | null) {
          if (value !== null && isFinite(value)) {
            const { sum , count } = result;

            return {
              sum: sum + value,
              count: count + 1,
            }
          }

          return result;
        },
        {
          sum: 0,
          count: 0,
        }
      );

      matrix[j + chunkSize / 2][i + chunkSize / 2] =
        sum / count + randomInRange(-randomFactor, randomFactor);
    }
  }
}

function calculateDiamond(matrix: number[][], chunkSize: number, randomFactor: number = 1): void {
  const half = chunkSize / 2;

  for (let y = 0; y < matrix.length; y += half) {
    for (let x = (y + half) % chunkSize; x < matrix.length; x += chunkSize) {
      const bottom = matrix[y + half] ? matrix[y + half][x] : null;
      const left = matrix[y][x - half];
      const top = matrix[y - half] ? matrix[y - half][x] : null;
      const right = matrix[y][x + half];
      const square = [bottom, left, top, right];
      const { count, sum } = square.reduce(function (result, value: number | null) {
          if (value !== null && isFinite(value)) {
            const { sum , count } = result;

            return {
              sum: sum + value,
              count: count + 1,
            }
          }
          return result;
        },
        {
          sum: 0,
          count: 0,
        }
      );
      matrix[y][x] = sum / count + randomInRange(-randomFactor, randomFactor);
    }
  }
}

export function normalizeMatrix(matrix: number[][]): number[][] {
  const maxValue = matrix.reduce(function (_, row: number[]): number {
    return row.reduce(function (max, value): number {
      return Math.max(value, max);
    });
  }, -Infinity);

  return matrix.map(function (row: number[]): number[] {
    return row.map(function (value: number) {
      return value / maxValue;
    });
  });
}

export function diamondSquare(size: number, randomFactor: number = 100): number[][] {
  const matrix = generateMatrix(size, randomFactor);

  let chunkSize = Math.pow(2, size);

  while (chunkSize > 1) {
    calculateSquare(matrix, chunkSize, randomFactor);
    calculateDiamond(matrix, chunkSize, randomFactor);
    chunkSize /= 2;
    randomFactor /= 2;
  }

  return normalizeMatrix(matrix);
}

export async function getLandscapeMatrixFromDiamondSquare(size: number, randomFactor: number = 10): Promise<ILandscape[][]> {
  const matrix = diamondSquare(size, randomFactor);

  return matrix.map(function (row: number[]): ILandscape[] {
    return row.map(function (percentage: number): ILandscape {
      const hsl = PercentageToHSL(percentage);

      return HSLtoLandscape(hsl);
    });
  });
}
