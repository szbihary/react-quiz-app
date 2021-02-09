import { Badge } from "react-bootstrap";
import { MAX_ROUND } from "../../config";

export const RoundInfo = ({ round }) => {
  const roundInfoText = `Round: ${round}/${MAX_ROUND}`;
  return (
    <Badge pill variant="info">
      {roundInfoText}
    </Badge>
  );
};
