import { useSelector } from "react-redux";
import styles from "./game.module.css";
import { QuizForm } from "../quiz-form/QuizForm";
import { GameOver } from "../game-over/GameOver";
import { StartPage } from "../start-page/StartPage";
import { Win } from "../win/Win";

export const Game = () => {
  const gameStatus = useSelector((state) => state.quiz.gameStatus);
  let content;

  switch (gameStatus) {
    case "started":
      content = <QuizForm />;
      break;
    case "win":
      content = <Win />;
      break;
    case "lose":
      content = <GameOver />;
      break;
    default:
      // initial
      content = <StartPage />;
  }

  return <div className={styles.frame}>{content}</div>;
};
