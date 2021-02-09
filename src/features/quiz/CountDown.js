import { useState, useEffect } from "react";

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

  const timeLeftString = `Remaining time: ${timeLeft}s`;

  return <div>{timeLeftString}</div>;
};
