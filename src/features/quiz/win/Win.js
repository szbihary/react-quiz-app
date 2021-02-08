import { useDispatch } from "react-redux";
import { restart } from "../quizSlice";
import styles from "./win.module.css";

export const Win = () => {
  const dispatch = useDispatch();

  const handleRestart = () => {
    dispatch(restart());
  };

  return (
    <div className={styles.container}>
      <h2> You won!</h2>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
};
