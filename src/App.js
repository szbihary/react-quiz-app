import React from "react";
import { QuizGame } from "./features/quiz/quiz-game/QuizGame";
import styles from "./App.module.css";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container className={styles.app}>
      <QuizGame />
    </Container>
  );
}

export default App;
