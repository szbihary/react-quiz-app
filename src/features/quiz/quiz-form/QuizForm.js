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
import { Button, Card, Alert, Form } from "react-bootstrap";

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
        <div className="row">
          <dt className="col-sm-2">Category</dt>
          <dd className="col-sm-10">{category}</dd>
        </div>
        <div className="row">
          <dt className="col-sm-2">Question</dt>
          <dd className="col-sm-10">{question}</dd>
        </div>
      </>
    );
  }

  let answerSection;
  let actions;
  let headerText = "Quiz";

  if (gameStatus === "started") {
    answerSection = (
      <Form>
        <Form.Group controlId="formAnswer">
          <Form.Label className={styles.answerLabel}>Your answer</Form.Label>
          <Form.Control
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form>
    );
    actions = (
      <Button
        variant="primary"
        type="submit"
        aria-label="Answer the quiz"
        className={styles.submitButton}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    );
  } else if (gameStatus === "win") {
    headerText += " - You won!";
    actions = (
      <Button variant="primary" type="submit" onClick={handleRestart}>
        Restart
      </Button>
    );
  } else if (gameStatus === "lose") {
    const { answer } = quizItem;
    const answerMessage = `The correct answer was: ${answer}`;
    headerText += " - Game Over";
    answerSection = <Alert variant="danger">{answerMessage}</Alert>;
    actions = (
      <Button variant="primary" type="submit" onClick={handleRestart}>
        Restart
      </Button>
    );
  }

  return (
    <Card className={styles.card}>
      <Card.Header className={styles.header}>{headerText}</Card.Header>
      <Card.Body>
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
        {answerSection}
      </Card.Body>
      <Card.Footer>{actions}</Card.Footer>
    </Card>
  );
};
