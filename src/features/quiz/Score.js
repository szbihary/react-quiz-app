import React from "react";
import { Badge } from "react-bootstrap";
import { getScoreOfRound, getScoreSum } from "./utils";

export const Score = React.memo(({ round, topScore }) => {
  const pointsOfRound = getScoreOfRound(round - 1);
  const userScore = getScoreSum(round - 1);

  const roundInfoText = `Points for the current round: ${pointsOfRound}`;
  const userScoreText = `User score: ${userScore}`;
  const topScoreText = `Top score: ${topScore}`;
  return (
    <>
      <Badge pill variant="info">
        {roundInfoText}
      </Badge>
      <Badge pill variant="info">
        {userScoreText}
      </Badge>
      <Badge pill variant="info">
        {topScoreText}
      </Badge>
    </>
  );
});
