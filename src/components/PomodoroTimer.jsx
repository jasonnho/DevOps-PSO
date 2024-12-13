import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './PomodoroTimer.module.css';

function PomodoroTimer({ initialTime, onComplete, onPause }) {
  const [timeLeft, setTimeLeft] = useState(initialTime || 1500); // Default to 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onPause(300); // Reset timer to 5 minutes (300 seconds) and move item to "Do Later"
    }
  }, [isRunning, timeLeft]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  return (
    <div className={styles.timer}>
      <div>{formatTime(timeLeft)}</div>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Pause</button>
    </div>
  );
}

PomodoroTimer.propTypes = {
  initialTime: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
};

export default PomodoroTimer;
