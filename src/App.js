import React from "react";
import { QuizForm } from "./features/quiz/quiz-form/QuizForm";
import styles from "./App.module.css";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container className={styles.app}>
      <QuizForm />
    </Container>
  );
}

export default App;
