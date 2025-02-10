/**
 * Represents a single option within a poll.
 */
export interface PollOption {
  /**
   * Unique identifier for the poll option.
   */
  id: string;

  /**
   * The text label for this option.
   */
  text: string;

  /**
   * The current vote count for this option.
   */
  voteCount: number;
}

/**
 * Represents a poll.
 */
export interface Poll {
  /**
   * Unique identifier for the poll.
   */
  id: string;

  /**
   * The poll question.
   */
  question: string;

  /**
   * List of available voting options.
   */
  options: PollOption[];

  /**
   * ISO date string representing when the poll was created.
   */
  createdAt: string;
}

/**
 * Input payload for creating a new poll.
 *
 * @remarks
 * The `options` array should have at least 1 and at most 5 items.
 */
export interface CreatePollInput {
  /**
   * The poll question.
   */
  question: string;

  /**
   * An array of strings representing the option labels.
   */
  options: string[];
}

/**
 * Input payload for voting on a poll option.
 */
export interface VoteInput {
  /**
   * The identifier of the poll being voted on.
   */
  pollId: string;

  /**
   * The identifier of the option receiving the vote.
   */
  optionId: string;
}
