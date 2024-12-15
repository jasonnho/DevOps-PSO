import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './SecondPomodoroTimer.module.css';

function SecondPomodoroTimer({ initialTime, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(initialTime || 300); 
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [isRunning, timeLeft, onComplete]);

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

SecondPomodoroTimer.propTypes = {
  initialTime: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
};

export default SecondPomodoroTimer;
