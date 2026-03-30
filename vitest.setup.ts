import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Zen_Kaku_Gothic_New: () => ({ className: "mock-font-class" }),
}));
