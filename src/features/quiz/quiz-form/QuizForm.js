import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./quizForm.module.css";
import {
  evaluateAnswer,
  timerEnded,
  restart,
  selectQuizItem,
  selectRound,
  selectTopScore,
  selectQuestionsCount,
  selectFetchStatus,
  selectGameStatus,
  selectError,
  fetchQuestion,
} from "../quizSlice";
import { AVAILABLE_TIME_SEC } from "../../../config";
import { CountDown } from "../CountDown";
import { RoundInfo } from "../RoundInfo";
import { Score } from "../Score";

export const QuizForm = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const dispatch = useDispatch();

  const quizItem = useSelector(selectQuizItem);
  const round = useSelector(selectRound);
  const fetchStatus = useSelector(selectFetchStatus);
  const gameStatus = useSelector(selectGameStatus);
  const error = useSelector(selectError);
  const topScore = useSelector(selectTopScore);
  const questionsCount = useSelector(selectQuestionsCount);

  useEffect(() => {
    if (gameStatus === "started") {
      dispatch(fetchQuestion());
    }
  }, [dispatch, round, gameStatus]);

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(evaluateAnswer(userAnswer));
    setUserAnswer("");
  };

  const handleTimerEnd = () => {
    dispatch(timerEnded());
  };

  const handleRestart = () => {
    dispatch(restart());
  };

  let content;
  if (fetchStatus === "loading") {
    content = <div className="loader">Loading a question...</div>;
  } else if (fetchStatus === "error") {
    content = <div>{error}</div>;
  } else {
    const { question, category } = quizItem;
    content = (
      <>
        <div className={styles.question}>
          <div>
            <label>Category: </label>
            <span>{category}</span>
          </div>
          <div>
            <label>Question: </label>
            <span>{question}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Your answer: </label>
          <input
            id="answer"
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            aria-label="Answer the quiz"
            className={styles.submitButton}
          >
            Submit
          </button>
        </form>
      </>
    );
  }

  let result;

  if (gameStatus === "win") {
    result = (
      <>
        <h2> You Won!</h2>
        <button onClick={handleRestart}>Restart</button>
      </>
    );
  } else if (gameStatus === "lose") {
    const { answer } = quizItem;
    const answerMessage = `The correct answer was: ${answer}`;
    result = (
      <>
        <div className={styles.answer}>{answerMessage}</div>
        <div className={styles.result}>
          <h3>Game Over!</h3>
          <button onClick={handleRestart}>Restart</button>
        </div>
      </>
    );
  }

  return (
    <div class={styles.quiz}>
      <div className={styles.gameInfo}>
        <RoundInfo round={round} />
        <Score round={round} topScore={topScore} />
        <CountDown
          key={questionsCount}
          seconds={AVAILABLE_TIME_SEC}
          onComplete={handleTimerEnd}
          suspend={gameStatus !== "started"}
        />
      </div>
      {content}
      {result}
    </div>
  );
};
