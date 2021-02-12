import React from "react";
import { Badge } from "react-bootstrap";
import { getScoreOfRound, getScoreSum } from "./utils";
import { MAX_ROUND } from "../../config";

export const GameInfo = React.memo(({ round, topScore }) => {
  const pointsOfRound = getScoreOfRound(round - 1);
  const userScore = getScoreSum(round - 1);

  const gameInfoItems = [
    `Round: ${round}/${MAX_ROUND}`,
    `Points for the current round: ${pointsOfRound}`,
    `User score: ${userScore}`,
    `Top score: ${topScore}`,
  ];
  return (
    <>
      {gameInfoItems.map((gameInfoItem) => (
        <Badge pill variant="info">
          {gameInfoItem}
        </Badge>
      ))}
    </>
  );
});
