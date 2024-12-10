import { useReducer } from "react";
import { AppContext } from "./AppContext"; // Import AppContext
import { loadState, saveState } from "../local-storage.js";
import { format } from "date-fns";
import PropTypes from "prop-types";

const appStateReducer = (state, action) => {
  let nd = new Date();

  let currentDate = {
    day: format(nd, "dd"),
    dayDisplay: format(nd, "d"),
    month: format(nd, "MM"),
    monthDisplay: format(nd, "MMM"),
    year: format(nd, "y"),
    weekday: format(nd, "EEEE"),
  };

  switch (action.type) {
    case "ADD_ITEM": {
      const newState = { ...state, items: state.items.concat(action.item) };
      saveState(newState);
      return newState;
    }
    case "UPDATE_ITEM": {
      const newItems = state.items.map((i) =>
        i.key === action.item.key ? { ...i, status: action.item.status } : i
      );
      const newState = { ...state, items: newItems };
      saveState(newState);
      return newState;
    }
    case "DELETE_ITEM": {
      const newState = {
        ...state,
        items: state.items.filter((item) => item.key !== action.item.key),
      };
      saveState(newState);
      return newState;
    }
    case "RESET_ALL": {
      const newItems = state.items
        .filter((item) => item.status !== "completed")
        .map((i) => (i.status === "paused" ? { ...i, status: "pending" } : i));
      const newState = { ...state, items: newItems, date: currentDate };
      saveState(newState);
      return newState;
    }
    default:
      return state;
  }
};

export function AppStateProvider({ children }) {
  let initialState = loadState();

  if (!initialState || !initialState.date) {
    let nd = new Date();

    initialState = {
      items: [],
      date: {
        day: format(nd, "dd"),
        dayDisplay: format(nd, "d"),
        month: format(nd, "MM"),
        monthDisplay: format(nd, "MMM"),
        year: format(nd, "y"),
        weekday: format(nd, "EEEE"),
      },
    };
  }

  saveState(initialState);

  const value = useReducer(appStateReducer, initialState);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};