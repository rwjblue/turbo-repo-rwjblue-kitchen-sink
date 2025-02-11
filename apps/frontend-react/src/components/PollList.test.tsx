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
        body: JSON.stringify({ pollId: "1", optionId: "1" }),
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

  it("sorts polls by total votes in descending order", () => {
    const pollsToSort: Poll[] = [
      {
        id: "1",
        question: "First Poll",
        createdAt: new Date().toISOString(),
        options: [
          { id: "1", text: "Option 1", voteCount: 1 },
          { id: "2", text: "Option 2", voteCount: 2 },
        ], // Total: 3 votes
      },
      {
        id: "2",
        question: "Second Poll",
        createdAt: new Date().toISOString(),
        options: [
          { id: "3", text: "Option 1", voteCount: 3 },
          { id: "4", text: "Option 2", voteCount: 4 },
        ], // Total: 7 votes
      },
    ];

    render(<PollList polls={pollsToSort} onVote={onVote} />);

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("Second Poll");
    expect(headings[1]).toHaveTextContent("First Poll");
  });

  it("maintains sort order when votes are equal", () => {
    const pollsWithEqualVotes: Poll[] = [
      {
        id: "1",
        question: "First Poll",
        createdAt: new Date().toISOString(),
        options: [
          { id: "1", text: "Option 1", voteCount: 2 },
          { id: "2", text: "Option 2", voteCount: 1 },
        ], // Total: 3 votes
      },
      {
        id: "2",
        question: "Second Poll",
        createdAt: new Date().toISOString(),
        options: [
          { id: "3", text: "Option 1", voteCount: 1 },
          { id: "4", text: "Option 2", voteCount: 2 },
        ], // Total: 3 votes
      },
    ];

    render(<PollList polls={pollsWithEqualVotes} onVote={onVote} />);

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("First Poll");
    expect(headings[1]).toHaveTextContent("Second Poll");
  });
});
