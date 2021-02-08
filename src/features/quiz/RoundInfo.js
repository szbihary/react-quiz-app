import { MAX_ROUND } from "../../config";

export const RoundInfo = ({ round }) => {
  const roundInfoText = `Round: ${round}/${MAX_ROUND}`;
  return <span>{roundInfoText}</span>;
};
