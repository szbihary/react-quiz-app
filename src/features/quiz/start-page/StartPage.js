import { useDispatch } from "react-redux";
import { restart } from "../quizSlice";
import styles from "./startPage.module.css";
import { MAX_ROUND } from "../../../config";

export const StartPage = () => {
  const dispatch = useDispatch();

  const handleClickStart = () => {
    dispatch(restart());
  };
  const bannerText = `In this Quiz game you can challenge your knowledge with ${MAX_ROUND} Trivia questions.`;

  return (
    <div className={styles.container}>
      <p>{bannerText}</p>
      <button onClick={handleClickStart}>Start Game</button>
    </div>
  );
};
