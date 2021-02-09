import React from "react";
import { QuizForm } from "./features/quiz/quiz-form/QuizForm";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>Quiz game</header>
      <QuizForm />
    </div>
  );
}

export default App;
