import { type ReactElement } from "react";
import type { Poll } from "@repo/models";

interface PollListProps {
  polls: Poll[];
  onVote: () => void;
}

export function PollList({ polls, onVote }: PollListProps): ReactElement {
  const handleVote = async (pollId: string, optionId: string) => {
    const response = await fetch("/api/polls/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId, optionId }),
    });

    if (response.ok) {
      onVote();
    }
  };

  return (
    <div className="poll-list">
      {polls.map((poll) => (
        <div key={poll.id} className="poll-card">
          <h3>{poll.question}</h3>
          <div className="poll-options">
            {poll.options.map((option) => (
              <div key={option.id} className="poll-option">
                <span className="option-text">
                  {option.text} ({option.voteCount} votes)
                </span>
                <button
                  onClick={() => handleVote(poll.id, option.id)}
                  className="vote-button"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
