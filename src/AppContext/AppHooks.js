import { useContext } from "react";
import { AppContext } from "./AppContext";

export function useAppState() {
  const state = useContext(AppContext)[0];
  return state;
}

export function useAppReducer() {
  return useContext(AppContext)[1];
}

export function useItems() {
  const { items } = useAppState();

  const pending = items.filter((item) => item.status === "pending");
  const paused = items.filter((item) => item.status === "paused");
  const completed = items.filter((item) => item.status === "completed");

  return { pending, paused, completed };
}
