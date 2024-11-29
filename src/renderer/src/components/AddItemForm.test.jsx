import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppContextProvider, useAppReducer } from "../AppContext.jsx";
import AddItemForm from "./AddItemForm.jsx";

// Mocking AppContext
vi.mock("../AppContext.jsx", () => {
	return {
		useAppReducer: vi.fn(),
		AppContextProvider: ({ children }) => <div>{children}</div>,
	};
});

describe("AddItemForm", () => {
	it("harus merender formulir dengan benar", () => {
		// Render komponen
		render(
			<AppContextProvider>
				<AddItemForm />
			</AppContextProvider>
		);

		// Memastikan input dan tombol ada di dokumen
		const inputElement = screen.getByPlaceholderText("Add new item");
		const buttonElement = screen.getByRole("button");

		expect(inputElement).toBeInTheDocument();
		expect(buttonElement).toBeInTheDocument();
	});

	it("harus memanggil dispatch dengan item baru saat formulir disubmit", () => {
		// Mock fungsi dispatch
		const dispatchMock = vi.fn();
		useAppReducer.mockReturnValue(dispatchMock);

		// Render komponen
		render(
			<AppContextProvider>
				<AddItemForm />
			</AppContextProvider>
		);

		// Mendapatkan elemen input dan tombol
		const inputElement = screen.getByPlaceholderText("Add new item");
		const buttonElement = screen.getByRole("button");

		// Simulasi mengetik di input
		const nilaiTes = "Item Tes";
		fireEvent.change(inputElement, { target: { value: nilaiTes } });

		// Simulasi submit formulir
		fireEvent.click(buttonElement);

		// Memastikan dispatch dipanggil dengan payload yang benar
		expect(dispatchMock).toHaveBeenCalledWith({
			type: "ADD_ITEM",
			item: expect.objectContaining({
				text: nilaiTes,
				status: "pending",
			}),
		});

		// Memastikan input dikosongkan setelah submit
		expect(inputElement.value).toBe("");
	});
});