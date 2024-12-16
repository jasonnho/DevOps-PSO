import PropTypes from "prop-types";
import { useState } from "react";
import { useAppReducer } from "../AppContext";
import styles from "./Item.module.css";

function Item({ item }) {
  const dispatch = useAppReducer();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let text = item.text;
  let paused = item.status === "paused";
  let completed = item.status === "completed";

  function deleteItem() {
    dispatch({ type: "DELETE_ITEM", item });
  }

  function pauseItem() {
    const pausedItem = { ...item, status: "paused" };
    dispatch({ type: "UPDATE_ITEM", item: pausedItem });
  }

  function resumeItem() {
    const pendingItem = { ...item, status: "pending" };
    dispatch({ type: "UPDATE_ITEM", item: pendingItem });
  }

  function completeItem() {
    const completedItem = { ...item, status: "completed" };
    dispatch({ type: "UPDATE_ITEM", item: completedItem });
  }

  function updatePriority(priority) {
    dispatch({ type: "UPDATE_PRIORITY", item: { ...item, priority } });
    setDropdownOpen(false); // Close dropdown after selection
  }

  return (
    <div
      className={`${styles.item} ${
        paused ? styles.paused : completed ? styles.completed : ""
      }`}
      tabIndex="0"
    >
      {/* Priority indicator */}
      <div className={styles.priorityIndicator}>
        {item.priority === "green" && "🟩"}
        {item.priority === "orange" && "🟧"}
        {item.priority === "red" && "🟥"}
      </div>
      

      {/* Item name */}
      <div className={styles.itemname}>{text}</div>
      {item.status !== "completed" && (
          <div>
            <button
              className={styles.priorityToggle}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Priority ▼
            </button>
            {dropdownOpen && (
              <div className={styles.priorityDropdown}>
                <button
                  className={styles.greenFlag}
                  onClick={() => updatePriority("green")}
                >
                  🟩
                </button>
                <button
                  className={styles.orangeFlag}
                  onClick={() => updatePriority("orange")}
                >
                  🟧
                </button>
                <button
                  className={styles.redFlag}
                  onClick={() => updatePriority("red")}
                >
                  🟥
                </button>
              </div>
            )}
          </div>
        )}
      {/* Buttons */}
      <div
        className={`${styles.buttons} ${
          completed ? styles.completedButtons : ""
        }`}
      >
        {completed && <button className={styles.empty}></button>}
        <button
          className={styles.delete}
          onClick={deleteItem}
          data-testid="delete-button"
        >
        </button>
        {!paused && !completed && (
          <button
            className={styles.pause}
            onClick={pauseItem}
            data-testid="pause-button"
          >
          </button>
        )}
        {(paused || completed) && (
          <button
            className={styles.resume}
            onClick={resumeItem}
            aria-label="Resume item"
          >
          </button>
        )}
        {!completed && (
          <button
            className={styles.complete}
            onClick={completeItem}
            aria-label="Complete item"
          >
          </button>
        )}
        {/* Priority Dropdown */}
        
      </div>
    </div>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["pending", "paused", "completed"]).isRequired,
    priority: PropTypes.string,
  }).isRequired,
};

export default Item;
