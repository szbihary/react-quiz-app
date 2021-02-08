const sum = (a, b) => a + b;

export const getScoreOfRound = (round) => Math.pow(2, round);

export const getScoreSum = (round) => {
  return Array.from({ length: round }, (_, i) => i)
    .map(getScoreOfRound)
    .reduce(sum, 0);
};
