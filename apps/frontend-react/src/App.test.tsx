import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App.tsx";

describe("App", () => {
  it("renders headline", () => {
    render(<App />);
    expect(screen.getByText("React + Vite Frontend")).toBeInTheDocument();
  });

  it("should increment count on button click", () => {
    render(<App />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Count is 0");

    fireEvent.click(button);
    expect(button).toHaveTextContent("Count is 1");
  });

  it("should display HMR instruction text", () => {
    render(<App />);
    expect(screen.getByText(/Edit/)).toBeInTheDocument();
    expect(
      screen.getByText("src/App.tsx", { selector: "code" }),
    ).toBeInTheDocument();
  });
});
