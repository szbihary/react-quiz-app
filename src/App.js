import React from "react";
import { Counter } from "./features/counter/Counter";
import { Quiz } from "./features/quiz/Quiz";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Quiz />
      </header>
    </div>
  );
}

export default App;
