import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PollList } from "./PollList.tsx";
import type { Poll } from "@repo/models";

const mockPolls: Poll[] = [
  {
    id: "1",
    question: "Test Poll?",
    createdAt: new Date().toISOString(),
    options: [
      { id: "1", text: "Option 1", voteCount: 0 },
      { id: "2", text: "Option 2", voteCount: 5 },
    ],
  },
];

describe("PollList", () => {
  const onVote = vi.fn();

  beforeEach(() => {
    onVote.mockReset();
  });

  it("renders polls with their options", () => {
    render(<PollList polls={mockPolls} onVote={onVote} />);

    expect(screen.getByText("Test Poll?")).toBeInTheDocument();
    expect(screen.getByText("Option 1 (0 votes)")).toBeInTheDocument();
    expect(screen.getByText("Option 2 (5 votes)")).toBeInTheDocument();
  });

  it("handles voting", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({ ok: true });
    global.fetch = mockFetch;

    render(<PollList polls={mockPolls} onVote={onVote} />);

    const voteButtons = screen.getAllByText("Vote");
    fireEvent.click(voteButtons[0]);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: "1", optionId: 1 }),
      });
    });

    expect(onVote).toHaveBeenCalled();
  });

  it("renders empty state when no polls exist", () => {
    render(<PollList polls={[]} onVote={onVote} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("displays correct vote counts", () => {
    render(<PollList polls={mockPolls} onVote={onVote} />);

    const option1 = screen.getByText("Option 1 (0 votes)");
    const option2 = screen.getByText("Option 2 (5 votes)");

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });
});
