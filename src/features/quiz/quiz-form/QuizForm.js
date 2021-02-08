import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./quizForm.module.css";
import {
  evaluateAnswer,
  selectQuizItem,
  selectRound,
  selectTopScore,
  selectError,
  fetchQuestion,
} from "../quizSlice";

import { CountDown } from "../CountDown";
import { RoundInfo } from "../RoundInfo";
import { Score } from "../Score";

export const QuizForm = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const dispatch = useDispatch();

  const quizItem = useSelector(selectQuizItem);
  const round = useSelector(selectRound);
  const fetchStatus = useSelector((state) => state.quiz.fetchStatus);
  const error = useSelector(selectError);
  const topScore = useSelector(selectTopScore);

  useEffect(() => {
    dispatch(fetchQuestion());
  }, [dispatch, round]);

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(evaluateAnswer(userAnswer));
    setUserAnswer("");
  };

  if (fetchStatus === "loading") {
    return <div className="loader">Loading a question...</div>;
  }
  if (fetchStatus === "error") {
    return <div>{error}</div>;
  }
  const { question, category } = quizItem;
  return (
    <>
      <div className={styles.gameInfo}>
        <RoundInfo round={round} />
        <Score round={round} topScore={topScore} />
        <CountDown />
      </div>
      <div className={styles.question}>
        <div>
          <label>Category: </label>
          <span>{category.title}</span>
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
};
