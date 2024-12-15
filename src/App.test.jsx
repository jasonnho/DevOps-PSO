import { test, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { format } from "date-fns";
import App from "./App.jsx";

// Tes tanggal, bulan, tahun, dan hari dalam TodoDaterr
test("renders the day of the month", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(format(new Date(), "d"));
  expect(linkElement).toBeInTheDocument();
});

test("renders the month", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(format(new Date(), "MMM"));
  expect(linkElement).toBeInTheDocument();
});

test("renders the year", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(format(new Date(), "y"));
  expect(linkElement).toBeInTheDocument();
});

test("renders the weekday", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(format(new Date(), "EEEE"));
  expect(linkElement).toBeInTheDocument();
});

// Tes fitur Add Item
test("adds a new item to the list", () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(<App />);
  const input = getByPlaceholderText("Add new item");
  const addButton = getByTestId("add-button");

  fireEvent.change(input, { target: { value: "New Task" } });
  fireEvent.click(addButton);

  expect(getByText("New Task")).toBeInTheDocument();
});
