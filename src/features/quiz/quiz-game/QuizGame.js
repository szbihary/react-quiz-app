import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./quizGame.module.css";
import {
  evaluateAnswer,
  timeout,
  restart,
  selectQuizItem,
  selectRound,
  selectTopScore,
  selectQuestionsCount,
  selectIsLoading,
  selectGameStatus,
  selectError,
  fetchQuestion,
  GAME_STATUS,
} from "../quizSlice";
import { AVAILABLE_TIME_SEC } from "../../../config";
import { CountDown } from "../CountDown";
import { GameInfo } from "../GameInfo";
import { Button, Card, Alert, Form, Row, Col, Spinner } from "react-bootstrap";

export const QuizGame = () => {
  const [userAnswer, setUserAnswer] = useState("");
  const dispatch = useDispatch();
  const answerInput = useRef(null);

  const quizItem = useSelector(selectQuizItem);
  const round = useSelector(selectRound);
  const isLoading = useSelector(selectIsLoading);
  const gameStatus = useSelector(selectGameStatus);
  const error = useSelector(selectError);
  const topScore = useSelector(selectTopScore);
  const questionsCount = useSelector(selectQuestionsCount);

  useEffect(() => {
    if (gameStatus === GAME_STATUS.STARTED) {
      dispatch(fetchQuestion());
    }
  }, [dispatch, round, gameStatus]);

  useEffect(() => {
    if (gameStatus === GAME_STATUS.STARTED && isLoading === false) {
      answerInput.current.focus();
    }
  }, [gameStatus, isLoading]);

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(evaluateAnswer(userAnswer));
    setUserAnswer("");
  };

  const handleTimerEnd = () => {
    dispatch(timeout());
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
  if (isLoading) {
    content = (
      <div className={styles.spinnerBox}>
        <Spinner animation="border" data-testid="loader" aria-hidden="true">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }
  if (error) {
    content = <Alert variant="danger">{error}</Alert>;
  }

  let answerSection;
  let actions;
  let headerText = "Quiz";

  if (gameStatus === GAME_STATUS.STARTED && !error) {
    actions = (
      <Button
        variant="primary"
        type="submit"
        aria-label="Answer the quiz"
        onClick={handleSubmit}
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

  if (gameStatus === GAME_STATUS.WIN) {
    headerText += " - You won!";
  } else if (gameStatus === GAME_STATUS.LOSE) {
    const { answer } = quizItem;
    const answerMessage = `The correct answer: ${answer}`;
    headerText += " - Game Over";
    answerSection = <Alert variant="danger">{answerMessage}</Alert>;
  }

  const question = !isLoading && quizItem?.question;
  const category = !isLoading && quizItem?.category;

  return (
    <Card className={styles.card}>
      <Card.Header className={styles.header}>{headerText}</Card.Header>
      <Card.Body className={styles.cardBody}>
        <div className={styles.gameInfo}>
          <GameInfo round={round} topScore={topScore} />
          <CountDown
            key={questionsCount}
            seconds={AVAILABLE_TIME_SEC}
            onComplete={handleTimerEnd}
            suspend={gameStatus !== GAME_STATUS.STARTED || isLoading}
          />
        </div>
        <Row>
          <Col md="2" id="categoryLabel" className={styles.label}>
            Category
          </Col>
          <Col md="10" aria-labelledby="categoryLabel">
            {category}
          </Col>
        </Row>
        <Row>
          <Col md="2" id="questionLabel" className={styles.label}>
            Question
          </Col>
          <Col md="10" aria-labelledby="questionLabel" data-testid="question">
            {question}
          </Col>
        </Row>
        <Row>
          <Col md="2" id="answerLabel" className={styles.label}>
            Your answer
          </Col>
          <Col>
            <Form.Control
              type="text"
              aria-labelledby="answerLabel"
              value={userAnswer}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={
                isLoading || error || gameStatus !== GAME_STATUS.STARTED
              }
              ref={answerInput}
              placeholder="Type your answer"
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
