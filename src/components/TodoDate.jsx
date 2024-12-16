import { useAppState } from "../AppContext";
import useDateCheck from "../hooks/useDateCheck.js";
import PomodoroTimer from "./PomodoroTimer"; 
import styles from "./TodoDate.module.css";

function TodoDate() {
  const { date } = useAppState();

  useDateCheck();

  return (
    <div>
      <div className={styles.date}>
        <div className={styles.calendar}>
          <div className={styles.day}>{date.dayDisplay}</div>
          <div className={styles.my}>
            <div className={styles.month}>{date.monthDisplay}</div>
            <div className={styles.year}>{date.year}</div>
          </div>
        </div>
        <div className="today">{date.weekday}</div>
      </div>
      <div className={styles.pomodoroContainer}>
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default TodoDate;
