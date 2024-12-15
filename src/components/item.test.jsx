function Item({ item }) {
  const { dispatch } = useAppReducer();

  const handlePause = () => {
    dispatch({ type: 'UPDATE_ITEM', item: { ...item, status: 'paused' } });
  };

  const handleResume = () => {
    dispatch({ type: 'UPDATE_ITEM', item: { ...item, status: 'pending' } });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_ITEM', item });
  };

  return (
    <div>
      <p>{item.text}</p>
      {item.status === 'paused' ? (
        <button aria-label="Resume item" onClick={handleResume}>
          Resume
        </button>
      ) : (
        <button data-testid="pause-button" onClick={handlePause}>
          Pause
        </button>
      )}
      <button data-testid="delete-button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}