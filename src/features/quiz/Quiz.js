import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./quiz.module.css";
import { selectLastQuizItem } from "./quizSlice";
import { CountDown } from "./CountDown";

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
      <CountDown />
      <div>
        <label>Category: </label>
        <span>{category.title}</span>
      </div>
      <div>
        <label>Question: </label>
        <span>{question}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <label for="answer">Your answer: </label>
        <input
          id="answer"
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
        />
        <button type="submit" aria-label="Answer the quiz">
          Submit
        </button>
      </form>
    </div>
  );
};
