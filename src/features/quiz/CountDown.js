import { useState, useEffect } from "react";

export const CountDown = ({ seconds, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!timeLeft) {
      onTimerEnd();
      return;
    }
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimerEnd]);

  const timeLeftString = `Remaining time: ${timeLeft}s`;

  return <div title="Remaining time">{timeLeftString}</div>;
};
