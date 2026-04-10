/**
 * Calculates Game Points (GP) based on time and grid size.
 * 
 * Rules:
 * - If time > 120 → return 0
 * - If time < 5 → clamp to 5
 * - Formula:
 *   normalizedTime = (time - 5) / 115
 *   timeScore = Math.pow((1 - normalizedTime), 1.3)
 *   baseScore = timeScore * 1000
 * 
 * Difficulty multipliers:
 * - 5x5 → 1.0
 * - 6x6 → 1.3
 * - 7x7 → 1.6
 * 
 * Final:
 * GP = round(baseScore * difficultyMultiplier)
 * 
 * @param {number} timeInSeconds - The time taken to complete the game.
 * @param {string} gridSize - The size of the grid (e.g., "5x5", "6x6", "7x7").
 * @returns {number} The calculated GP.
 */
const calculateGP = (timeInSeconds, gridSize) => {
  let time = timeInSeconds;
  
  if (time > 120) {
    return 0;
  }
  
  if (time < 5) {
    time = 5;
  }

  const normalizedTime = (time - 5) / 115;
  const timeScore = Math.pow(1 - normalizedTime, 1.3);
  const baseScore = timeScore * 1000;

  let multiplier = 1.0;
  if (gridSize === "6x6") {
    multiplier = 1.3;
  } else if (gridSize === "7x7") {
    multiplier = 1.6;
  }
  // Default for 5x5 or any other size is 1.0

  const gp = Math.round(baseScore * multiplier);
  
  return gp;
};

module.exports = { calculateGP };
