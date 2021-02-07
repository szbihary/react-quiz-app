import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./quiz.module.css";
import { selectLastQuizItem } from "./quizSlice";
import { CountDown } from "./CountDown";
import { RoundInfo } from "../RoundInfo";

export const Quiz = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const quizItem = useSelector(selectLastQuizItem);
  const { question, answer, category } = quizItem;

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUserAnswer("");
  };

  return (
    <div className={styles.frame}>
      <div className={styles.gameInfo}>
        <RoundInfo round="1" />
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
        <label for="answer">Your answer: </label>
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
    </div>
  );
};
