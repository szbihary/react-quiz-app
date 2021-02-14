import { getScoreSum, getScoreOfRound } from "./utils";

describe("getScoreOfRound", () => {
  it("return the correct amount of score which can be gained in the given round (index start with 0)", () => {
    const round2 = 2;
    const round10 = 10;
    const scoreSum2 = getScoreOfRound(round2);
    const scoreSum10 = getScoreOfRound(round10);
    expect(scoreSum2).toBe(4);
    expect(scoreSum10).toBe(1024);
  });
});

describe("getScoreSum", () => {
  it("return the correct sum of score which a user will have succeeding in the given round (index start with 0)", () => {
    const round1 = 1;
    const round3 = 3;
    const scoreSum1 = getScoreSum(round1);
    const scoreSum3 = getScoreSum(round3);
    expect(scoreSum1).toBe(1);
    expect(scoreSum3).toBe(7);
  });
});
