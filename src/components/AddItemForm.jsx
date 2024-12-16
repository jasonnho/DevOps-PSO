import { useRef } from "react";
import { useAppReducer } from "../AppContext";
import styles from "./AddItemForm.module.css";

function AddItemForm() {
  const dispatch = useAppReducer();
  let inputRef = useRef();

  function addItem(e) {
    e.preventDefault();
    const newItem = {
      text: inputRef.current.value,
      key: Date.now(),
      status: "pending",
      priority: "none", // Default priority
    };
    if (newItem.text.trim()) {
      dispatch({ type: "ADD_ITEM", item: newItem });
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  return (
    <form className={styles.form} onSubmit={addItem}>
      <input ref={inputRef} placeholder="Add new item" autoFocus />
      <button type="submit" data-testid="add-button">
        Add
      </button>
    </form>
  );
}

export default AddItemForm;
