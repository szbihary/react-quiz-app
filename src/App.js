import React from "react";
import { Game } from "./features/quiz/game/Game";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>Quiz game</header>
      <Game />
    </div>
  );
}

export default App;
