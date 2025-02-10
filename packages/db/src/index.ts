import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import SQLiteDatabase from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import type { Database as ISQLiteDatabase } from "better-sqlite3";
import type {
  Poll,
  PollOption,
  CreatePollInput,
  VoteInput,
} from "@repo/models";

/**
 * Options for setting up the database.
 */
export interface DBOptions {
  /**
   * If provided, the filename of the SQLite DB.
   * If omitted and memory is not false, an in-memory DB will be used.
   */
  filename?: string;
  /**
   * Use an in-memory database instead of a file.
   */
  memory?: boolean;
  /**
   * Function to generate unique IDs. Defaults to internal implementation.
   * Primarily used for testing.
   */
  generateId?: () => string;
  /**
   * Function to get current timestamp. Defaults to new Date().toISOString().
   * Primarily used for testing.
   */
  now?: () => string;
}

/**
 * Interface for the database operations exposed by setup.
 */
export interface Database {
  /**
   * Creates a new poll and returns the created poll.
   */
  createPoll(input: CreatePollInput): Poll;
  /**
   * Casts a vote for a specific poll option and returns the updated poll.
   */
  vote(input: VoteInput): Poll | null;
  /**
   * Retrieves a single poll by its id.
   */
  getPoll(pollId: string): Poll | null;
  /**
   * Retrieves all polls sorted in descending order by total votes.
   */
  getPolls(): Poll[];
  /**
   * The underlying better-sqlite3 database instance.
   */
  db: ISQLiteDatabase;
}

class DatabaseManager implements Database {
  public db: ISQLiteDatabase;

  private generateId: () => string;
  private now: () => string;

  // Eagerly prepared statements.
  private stmtInsertPoll;
  private stmtInsertOption;
  private stmtUpdateVote;
  private stmtGetPoll;
  private stmtGetPollOptions;
  private stmtGetPolls;

  constructor(db: ISQLiteDatabase, options?: DBOptions) {
    this.db = db;

    this.generateId = options?.generateId ?? defaultGenerateId;
    this.now = options?.now ?? defaultNow;

    // Prepare all SQL statements.
    this.stmtInsertPoll = this.db.prepare(
      "INSERT INTO polls (id, question, createdAt) VALUES (?, ?, ?)",
    );
    this.stmtInsertOption = this.db.prepare(
      "INSERT INTO poll_options (pollId, text, voteCount) VALUES (?, ?, 0)",
    );
    this.stmtUpdateVote = this.db.prepare(
      "UPDATE poll_options SET voteCount = voteCount + 1 WHERE id = ? AND pollId = ?",
    );
    this.stmtGetPoll = this.db.prepare("SELECT * FROM polls WHERE id = ?");
    this.stmtGetPollOptions = this.db.prepare(
      "SELECT id, text, voteCount FROM poll_options WHERE pollId = ?",
    );
    this.stmtGetPolls = this.db.prepare(`
      SELECT p.id, p.question, p.createdAt,
        (SELECT SUM(voteCount) FROM poll_options WHERE pollId = p.id) as totalVotes
      FROM polls p
      ORDER BY totalVotes DESC
    `);
  }

  /**
   * Creates a new poll with the provided question and options.
   */
  public createPoll(input: CreatePollInput): Poll {
    if (input.options.length < 1 || input.options.length > 5) {
      throw new Error("Poll must have between 1 and 5 options");
    }

    const pollId = this.generateId();
    const createdAt = this.now();

    this.stmtInsertPoll.run(pollId, input.question, createdAt);
    for (const text of input.options) {
      this.stmtInsertOption.run(pollId, text);
    }

    const poll = this.getPoll(pollId);
    if (!poll) {
      throw new Error("Failed to retrieve the poll after creation");
    }
    return poll;
  }

  /**
   * Increments the vote count for a poll option.
   */
  public vote(input: VoteInput): Poll | null {
    const result = this.stmtUpdateVote.run(input.optionId, input.pollId);
    if (result.changes === 0) {
      throw new Error("No matching poll option found");
    }
    return this.getPoll(input.pollId);
  }

  /**
   * Retrieves a poll by its id, including its options.
   */
  public getPoll(pollId: string): Poll | null {
    const pollRow = this.stmtGetPoll.get(pollId) as null | Poll;
    if (!pollRow) return null;

    const options = this.stmtGetPollOptions.all(pollId) as PollOption[];

    return {
      id: pollRow.id,
      question: pollRow.question,
      createdAt: pollRow.createdAt,
      options,
    };
  }

  /**
   * Retrieves all polls sorted by total votes (descending).
   */
  public getPolls(): Poll[] {
    const polls = this.stmtGetPolls.all() as Poll[];

    return polls.map((pollRow: Poll) => {
      const options = this.stmtGetPollOptions.all(pollRow.id) as PollOption[];
      return {
        id: pollRow.id,
        question: pollRow.question,
        createdAt: pollRow.createdAt,
        options,
      };
    });
  }
}
/**
 * Sets up the database and returns an interface for poll operations.
 *
 * @param options - configuration options for the database.
 */
export function setup(options: DBOptions): Database {
  // Determine database location: in-memory if `memory` is true or no filename given.
  const dbFilename = options.memory
    ? ":memory:"
    : options.filename || "polls.db";

  if (dbFilename !== ":memory:") {
    const dir = dirname(dbFilename);
    if (dir !== ".") {
      mkdirSync(dir, { recursive: true });
    }
  }

  const db = new SQLiteDatabase(dbFilename);

  // Create tables if they do not exist.
  db.exec(`
    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS poll_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pollId TEXT NOT NULL,
      text TEXT NOT NULL,
      voteCount INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (pollId) REFERENCES polls(id)
    );
  `);

  return new DatabaseManager(db, options);
}

function defaultGenerateId(): string {
  return uuidv4();
}

function defaultNow() {
  return new Date().toISOString();
}
