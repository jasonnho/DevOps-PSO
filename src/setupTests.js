import "@testing-library/jest-dom"; 
import { vi } from "vitest";

vi.spyOn(console, "log").mockImplementation(() => {});
