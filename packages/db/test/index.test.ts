import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, it, expect, beforeEach } from "vitest";
import { setup, type Database } from "../src/index.ts";

describe("setup", () => {
  it("creates directory structure if it doesn't exist", () => {
    const tempPath = join(
      tmpdir(),
      `test-db-${Date.now()}`,
      "nested",
      "db.sqlite",
    );

    try {
      const db = setup({
        filename: tempPath,
      });

      expect(existsSync(tempPath)).toBe(true);

      // Cleanup
      db.db.close();
    } finally {
      // Clean up the test directory
      rmSync(join(tmpdir(), `test-db-${Date.now()}`), {
        recursive: true,
        force: true,
      });
    }
  });
});

describe("Database", () => {
  let db: Database;
  let idCounter = 0;

  beforeEach(() => {
    idCounter = 0;
    db = setup({
      memory: true,
      generateId: () => `test-id-${++idCounter}`,
      now: () => "2024-01-01T12:00:00.000Z",
    });
  });

  describe("createPoll", () => {
    it("creates a poll with valid options", () => {
      const poll = db.createPoll({
        question: "Favorite color?",
        options: ["Red", "Blue", "Green"],
      });

      expect(poll).toMatchInlineSnapshot(
        `
        {
          "createdAt": "2024-01-01T12:00:00.000Z",
          "id": "test-id-1",
          "options": [
            {
              "id": 1,
              "text": "Red",
              "voteCount": 0,
            },
            {
              "id": 2,
              "text": "Blue",
              "voteCount": 0,
            },
            {
              "id": 3,
              "text": "Green",
              "voteCount": 0,
            },
          ],
          "question": "Favorite color?",
        }
      `,
      );
    });

    it("throws error when options are out of range", () => {
      expect(() =>
        db.createPoll({
          question: "Invalid poll",
          options: [],
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: Poll must have between 1 and 5 options]`,
      );
    });
  });

  describe("vote", () => {
    it("increments vote count for valid option", () => {
      const poll = db.createPoll({
        question: "Test poll",
        options: ["Option 1", "Option 2"],
      });

      const updatedPoll = db.vote({
        pollId: poll.id,
        optionId: poll.options[0].id,
      });

      expect(updatedPoll).toMatchInlineSnapshot(
        `
        {
          "createdAt": "2024-01-01T12:00:00.000Z",
          "id": "test-id-1",
          "options": [
            {
              "id": 1,
              "text": "Option 1",
              "voteCount": 1,
            },
            {
              "id": 2,
              "text": "Option 2",
              "voteCount": 0,
            },
          ],
          "question": "Test poll",
        }
      `,
      );
    });

    it("throws error for invalid option", () => {
      const poll = db.createPoll({
        question: "Test poll",
        options: ["Option 1"],
      });

      expect(() =>
        db.vote({
          pollId: poll.id,
          optionId: "999",
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: No matching poll option found]`,
      );
    });
  });

  describe("getPolls", () => {
    it("returns polls ordered by vote count", async () => {
      const _poll1 = db.createPoll({
        question: "First poll",
        options: ["A", "B"],
      });

      const poll2 = db.createPoll({
        question: "Second poll",
        options: ["C", "D"],
      });

      db.vote({ pollId: poll2.id, optionId: poll2.options[0].id });

      const polls = db.getPolls();
      expect(polls).toMatchInlineSnapshot(`
        [
          {
            "createdAt": "2024-01-01T12:00:00.000Z",
            "id": "test-id-2",
            "options": [
              {
                "id": 3,
                "text": "C",
                "voteCount": 1,
              },
              {
                "id": 4,
                "text": "D",
                "voteCount": 0,
              },
            ],
            "question": "Second poll",
          },
          {
            "createdAt": "2024-01-01T12:00:00.000Z",
            "id": "test-id-1",
            "options": [
              {
                "id": 1,
                "text": "A",
                "voteCount": 0,
              },
              {
                "id": 2,
                "text": "B",
                "voteCount": 0,
              },
            ],
            "question": "First poll",
          },
        ]
      `);
    });
  });
});
