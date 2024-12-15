import PropTypes from 'prop-types';
import { useAppReducer } from '../AppContext';
import PomodoroTimer from './PomodoroTimer'; // Import the main PomodoroTimer component
import SecondPomodoroTimer from './SecondPomodoroTimer'; // Import the SecondPomodoroTimer component
import styles from './Item.module.css';

// Individual todo item
function Item({ item }) {
  const dispatch = useAppReducer();

  function deleteItem() {
    dispatch({ type: 'DELETE_ITEM', item });
  }

  function pauseItem(timeLeft) {
    const pausedItem = { ...item, status: 'paused', timer: timeLeft };
    dispatch({ type: 'UPDATE_ITEM', item: pausedItem });
  }

  function resumeItem() {
    const updatedItem = { ...item, status: 'pending', timer: item.timer || 1500 }; // Default to 25 minutes
    dispatch({ type: 'UPDATE_ITEM', item: updatedItem });
  }

  function completeItem() {
    const completedItem = { ...item, status: 'completed' };
    dispatch({ type: 'UPDATE_ITEM', item: completedItem });
  }

  return (
    <div
      className={`${styles.item} ${
        item.status === 'paused'
          ? styles.paused
          : item.status === 'completed'
          ? styles.completed
          : ''
      }`}
      tabIndex="0"
    >
      <div className={styles.itemname}>
        {item.text}
        {item.status === 'pending' && (
          <PomodoroTimer
            initialTime={item.timer}
            onComplete={completeItem}
            onPause={(timeLeft) => pauseItem(timeLeft)}
            mode="pending"
          />
        )}
        {item.status === 'paused' && (
          <SecondPomodoroTimer
            initialTime={item.timer}
            onComplete={() => resumeItem()} // Resumes to pending
            onPause={(timeLeft) => pauseItem(timeLeft)} // Keeps in "Do Later"
          />
        )}
      </div>
      <div
        className={`${styles.buttons} ${
          item.status === 'completed' ? styles.completedButtons : ''
        }`}
      >
        <button
          className={styles.delete}
          onClick={deleteItem}
          data-testid="delete-button"
          tabIndex="0"
        ></button>
        {item.status === 'paused' && (
          <button
            className={styles.resume}
            onClick={resumeItem} // Starts the Pomodoro timer
            aria-label="Resume"
            tabIndex="0"
          ></button>
        )}
        {item.status === 'pending' && (
          <button
            className={styles.pause}
            onClick={() => pauseItem(item.timer)}
            data-testid="pause-button"
            tabIndex="0"
          ></button>
        )}
        {item.status === 'pending' && (
          <button
            className={styles.complete}
            onClick={completeItem}
            aria-label="Complete"
            tabIndex="0"
          ></button>
        )}
      </div>
    </div>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['pending', 'paused', 'completed']).isRequired,
    timer: PropTypes.number,
  }).isRequired,
};

export default Item;