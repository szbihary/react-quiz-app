import { useState, useEffect, useRef } from "react";
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
import { Button, Card, Alert, Form, Row, Col, Spinner } from "react-bootstrap";

export const QuizForm = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const dispatch = useDispatch();
  const answerInput = useRef(null);

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

  useEffect(() => {
    if (gameStatus === "started" && fetchStatus === "success") {
      answerInput.current.focus();
    }
  }, [gameStatus, fetchStatus]);

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(evaluateAnswer(userAnswer));
    setUserAnswer("");
  };

  const handleTimerEnd = () => {
    dispatch(timerEnded());
  };

  const handleRestart = () => {
    dispatch(restart());
  };

  const handleKeyPress = (event) => {
    if (event.which === 13) {
      handleSubmit();
    }
  };

  let content;
  if (fetchStatus === "loading") {
    content = (
      <div className={styles.spinnerBox}>
        <Spinner animation="border" role="status" aria-hidden="true">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  } else if (fetchStatus === "error") {
    content = <Alert variant="danger">{error}</Alert>;
  }

  let answerSection;
  let actions;
  let headerText = "Quiz";

  if (gameStatus === "started") {
    actions = (
      <Button
        variant="primary"
        type="submit"
        aria-label="Answer the quiz"
        onClick={handleSubmit}
        disabled={fetchStatus !== "success"}
      >
        Submit
      </Button>
    );
  } else {
    actions = (
      <Button variant="primary" type="submit" onClick={handleRestart}>
        Restart
      </Button>
    );
  }

  if (gameStatus === "win") {
    headerText += " - You won!";
  } else if (gameStatus === "lose") {
    const { answer } = quizItem;
    const answerMessage = `The correct answer: ${answer}`;
    headerText += " - Game Over";
    answerSection = <Alert variant="danger">{answerMessage}</Alert>;
  }

  const question =
    fetchStatus !== "loading" && quizItem ? quizItem.question : "";
  const category =
    fetchStatus !== "loading" && quizItem ? quizItem.category : "";

  return (
    <Card className={styles.card}>
      <Card.Header className={styles.header}>{headerText}</Card.Header>
      <Card.Body className={styles.cardBody}>
        <div className={styles.gameInfo}>
          <RoundInfo round={round} />
          <Score round={round} topScore={topScore} />
          <CountDown
            key={questionsCount}
            seconds={AVAILABLE_TIME_SEC}
            onComplete={handleTimerEnd}
            suspend={gameStatus !== "started" || fetchStatus === "loading"}
          />
        </div>
        <Row>
          <Col md="2" className={styles.label}>
            Category
          </Col>
          <Col md="10">{category}</Col>
        </Row>
        <Row>
          <Col md="2" className={styles.label}>
            Question
          </Col>
          <Col md="10">{question}</Col>
        </Row>
        <Row>
          <Col md="2" className={styles.label}>
            Your answer
          </Col>
          <Col>
            <Form.Control
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={fetchStatus !== "success" || gameStatus !== "started"}
              ref={answerInput}
            />
          </Col>
        </Row>
        {content}
        {answerSection}
      </Card.Body>
      <Card.Footer className={styles.footer}>{actions}</Card.Footer>
    </Card>
  );
};
