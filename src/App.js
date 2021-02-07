import React from "react";
import { Quiz } from "./features/quiz/Quiz";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>Quiz game</header>
      <Quiz />
    </div>
  );
}

export default App;
