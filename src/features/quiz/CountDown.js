import { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";

const getColorLevel = (timeLeft) => {
  if (timeLeft > 10) {
    return "info";
  }
  if (timeLeft > 5) {
    return "warning";
  }
  return "danger";
};

export const CountDown = ({ seconds, onComplete, suspend }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!timeLeft) {
      onComplete();
      return;
    }
    if (suspend) {
      return;
    }
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete, suspend]);

  const timeLeftString = `Time left: ${timeLeft}s`;
  const colorLevel = getColorLevel(timeLeft);

  return (
    <Badge pill variant={colorLevel} role="timer">
      {timeLeftString}
    </Badge>
  );
};
