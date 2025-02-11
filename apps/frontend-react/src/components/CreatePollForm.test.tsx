import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreatePollForm } from "./CreatePollForm.tsx";

describe("CreatePollForm", () => {
  const onPollCreated = vi.fn();

  beforeEach(() => {
    onPollCreated.mockReset();
  });

  it("renders form elements", () => {
    render(<CreatePollForm onPollCreated={onPollCreated} />);

    expect(screen.getByPlaceholderText("Enter your question")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Add Option")).toBeInTheDocument();
    expect(screen.getByText("Create Poll")).toBeInTheDocument();
  });

  it("allows adding up to 5 options", () => {
    render(<CreatePollForm onPollCreated={onPollCreated} />);
    const addButton = screen.getByText("Add Option");

    // Click 4 times to add 4 more options (5 total)
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getAllByPlaceholderText(/Option \d/)).toHaveLength(5);
    expect(addButton).not.toBeVisible();
  });

  it("submits form with valid data", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({ ok: true });
    global.fetch = mockFetch;

    render(<CreatePollForm onPollCreated={onPollCreated} />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText("Enter your question"), {
      target: { value: "Test Question?" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option 1"), {
      target: { value: "Option One" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Create Poll"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "Test Question?",
          options: ["Option One"],
        }),
      });
    });

    expect(onPollCreated).toHaveBeenCalled();
  });
});
