import React from "react";
import { getScoreOfRound, getScoreSum } from "./utils";

export const Score = React.memo(({ round, topScore }) => {
  const pointsOfRound = getScoreOfRound(round - 1);
  const userScore = getScoreSum(round - 1);

  const roundInfoText = `Points for the current round: ${pointsOfRound}`;
  const userScoreText = `User Score: ${userScore}`;
  const topScoreText = `Top score: ${topScore}`;
  return (
    <>
      <div>{roundInfoText}</div>
      <div>{userScoreText}</div>
      <div>{topScoreText}</div>
    </>
  );
});
