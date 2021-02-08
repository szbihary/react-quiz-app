import { useSelector, useDispatch } from "react-redux";
import { restart, selectQuizItem } from "../quizSlice";
import styles from "./gameOver.module.css";

export const GameOver = () => {
  const dispatch = useDispatch();
  const { answer } = useSelector(selectQuizItem);
  const answerMessage = `The correct answer was: ${answer}`;

  const handleRestart = () => {
    dispatch(restart());
  };

  return (
    <div className={styles.container}>
      <h2>Game Over</h2>
      <p>{answerMessage}</p>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
};
