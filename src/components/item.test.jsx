import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Item from './item';
import { useAppReducer } from '../AppContext';

vi.mock('../AppContext', () => ({
  useAppReducer: vi.fn(),
}));

describe('Item Component', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    useAppReducer.mockReturnValue(dispatchMock); // Ensure this returns the correct structure
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const item = {
    id: 1,
    text: 'Test item',
    status: 'pending',
  };

  it('dispatches DELETE_ITEM when delete button is clicked', () => {
    const { getByTestId } = render(<Item item={item} />);
    const deleteButton = getByTestId('delete-button');
    
    fireEvent.click(deleteButton);

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'DELETE_ITEM', item });
  });

  it('dispatches UPDATE_ITEM with paused status when pause button is clicked', () => {
    const { getByTestId } = render(<Item item={item} />);
    const pauseButton = getByTestId('pause-button');
    
    fireEvent.click(pauseButton);

    expect(dispatchMock).toHaveBeenCalledWith({ 
      type: 'UPDATE_ITEM', 
      item: { ...item, status: 'paused' } 
    });
  });

  it('dispatches UPDATE_ITEM with pending status when resume button is clicked', () => {
    const pausedItem = { ...item, status: 'paused' };
    const { getByLabelText } = render(<Item item={pausedItem} />);
    const resumeButton = getByLabelText('Resume item');
    
    fireEvent.click(resumeButton);

    expect(dispatchMock).toHaveBeenCalledWith({ 
      type: 'UPDATE_ITEM', 
      item: { ...pausedItem, status: 'pending' } 
    });
  });
});
