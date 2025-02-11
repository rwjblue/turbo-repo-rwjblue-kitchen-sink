import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync, existsSync } from 'node:fs';
import { seed } from './index.ts';
import { setup } from '@repo/db';

describe('seed function', () => {
  const getTempDbPath = () => join(tmpdir(), `test-${Date.now()}.db`);
  let dbPath: string;

  beforeEach(() => {
    dbPath = getTempDbPath();
  });

  afterEach(() => {
    if (existsSync(dbPath)) {
      rmSync(dbPath);
    }
  });

  it('should create a single poll with correct structure', async () => {
    await seed({ count: 1, dbPath, seed: 42 });

    const db = setup({ filename: dbPath });
    const [poll] = db.getPolls();

    // Remove non-deterministic fields for snapshot
    const { id, createdAt, options } = poll;
    const sanitizedOptions = options.map(({ id, ...rest }) => rest);

    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(sanitizedOptions).toMatchInlineSnapshot(`
      [
        {
          "text": "JavaScript",
          "voteCount": 0,
        },
        {
          "text": "Python",
          "voteCount": 0,
        },
        {
          "text": "Java",
          "voteCount": 0,
        },
        {
          "text": "C++",
          "voteCount": 0,
        },
        {
          "text": "Rust",
          "voteCount": 0,
        },
      ]
    `);
  });

  it('should create multiple unique polls', async () => {
    await seed({ count: 3, dbPath, seed: 42 });

    const db = setup({ filename: dbPath });
    const polls = db.getPolls();

    // Sanitize non-deterministic fields
    const sanitizedPolls = polls.map(({ id, createdAt, options, ...rest }) => ({
      ...rest,
      options: options.map(({ id, ...opt }) => opt)
    }));

    expect(sanitizedPolls).toMatchInlineSnapshot(`
      [
        {
          "options": [
            {
              "text": "JavaScript",
              "voteCount": 0,
            },
            {
              "text": "Python",
              "voteCount": 0,
            },
            {
              "text": "Java",
              "voteCount": 0,
            },
            {
              "text": "C++",
              "voteCount": 0,
            },
            {
              "text": "Rust",
              "voteCount": 0,
            },
          ],
          "question": "What's your favorite programming language?",
        },
        {
          "options": [
            {
              "text": ".env files",
              "voteCount": 0,
            },
            {
              "text": "CI/CD Variables",
              "voteCount": 0,
            },
            {
              "text": "Secret Manager",
              "voteCount": 0,
            },
            {
              "text": "Config Files",
              "voteCount": 0,
            },
            {
              "text": "Runtime Config",
              "voteCount": 0,
            },
          ],
          "question": "How do you manage environment variables?",
        },
        {
          "options": [
            {
              "text": "npm",
              "voteCount": 0,
            },
            {
              "text": "yarn",
              "voteCount": 0,
            },
            {
              "text": "pnpm",
              "voteCount": 0,
            },
            {
              "text": "bun",
              "voteCount": 0,
            },
          ],
          "question": "Preferred package manager?",
        },
      ]
    `);
  });

  it('should handle in-memory database', async () => {
    await seed({ count: 2 }); // No dbPath = in-memory

    const db = setup({ filename: ':memory:' });
    const polls = db.getPolls();

    expect(polls).toMatchInlineSnapshot('[]');
  });

  it('should limit to available questions if count is too high', async () => {
    await seed({ count: 1000, dbPath });

    const db = setup({ filename: dbPath });
    const polls = db.getPolls();

    expect(polls.length).toMatchInlineSnapshot(`28`);
  });

  it('should create polls deterministically with seed', async () => {
    await seed({ count: 3, dbPath, seed: 42 });

    const db = setup({ filename: dbPath });
    const polls = db.getPolls();

    const sanitizedPolls = polls.map(({ id, createdAt, options, ...rest }) => ({
      ...rest,
      options: options.map(({ id, ...opt }) => opt)
    }));

    expect(sanitizedPolls).toMatchInlineSnapshot(`
      [
        {
          "options": [
            {
              "text": "JavaScript",
              "voteCount": 0,
            },
            {
              "text": "Python",
              "voteCount": 0,
            },
            {
              "text": "Java",
              "voteCount": 0,
            },
            {
              "text": "C++",
              "voteCount": 0,
            },
            {
              "text": "Rust",
              "voteCount": 0,
            },
          ],
          "question": "What's your favorite programming language?",
        },
        {
          "options": [
            {
              "text": ".env files",
              "voteCount": 0,
            },
            {
              "text": "CI/CD Variables",
              "voteCount": 0,
            },
            {
              "text": "Secret Manager",
              "voteCount": 0,
            },
            {
              "text": "Config Files",
              "voteCount": 0,
            },
            {
              "text": "Runtime Config",
              "voteCount": 0,
            },
          ],
          "question": "How do you manage environment variables?",
        },
        {
          "options": [
            {
              "text": "npm",
              "voteCount": 0,
            },
            {
              "text": "yarn",
              "voteCount": 0,
            },
            {
              "text": "pnpm",
              "voteCount": 0,
            },
            {
              "text": "bun",
              "voteCount": 0,
            },
          ],
          "question": "Preferred package manager?",
        },
      ]
    `);
  });

  it('should create same sequence with same seed', async () => {
    await seed({ count: 3, dbPath, seed: 42 });
    const db1 = setup({ filename: dbPath });
    const polls1 = db1.getPolls();

    rmSync(dbPath);

    await seed({ count: 3, dbPath, seed: 42 });
    const db2 = setup({ filename: dbPath });
    const polls2 = db2.getPolls();

    expect(polls1.map(p => p.question))
      .toEqual(polls2.map(p => p.question));
  });

  it('should create different sequences with different seeds', async () => {
    await seed({ count: 3, dbPath, seed: 42 });
    const db1 = setup({ filename: dbPath });
    const polls1 = db1.getPolls();

    rmSync(dbPath);

    await seed({ count: 3, dbPath, seed: 43 });
    const db2 = setup({ filename: dbPath });
    const polls2 = db2.getPolls();

    expect(polls1.map(p => p.question))
      .not.toEqual(polls2.map(p => p.question));
  });

  it('should successfully create random polls without a seed', async () => {
    await seed({ count: 3, dbPath });

    const db = setup({ filename: dbPath });
    const polls = db.getPolls();

    // Basic structure checks
    expect(polls).toHaveLength(3);
    polls.forEach(poll => {
      expect(poll).toHaveProperty('id');
      expect(poll).toHaveProperty('question');
      expect(poll.options.length).toBeGreaterThan(0);
      expect(poll.options[0]).toHaveProperty('text');
      expect(poll.options[0]).toHaveProperty('voteCount', 0);
    });
  });

  it('should generate different sequences when called without seed', async () => {
    // First run
    await seed({ count: 3, dbPath });
    const db1 = setup({ filename: dbPath });
    const questions1 = db1.getPolls().map(p => p.question);

    // Clean up and second run
    rmSync(dbPath);
    await seed({ count: 3, dbPath });
    const db2 = setup({ filename: dbPath });
    const questions2 = db2.getPolls().map(p => p.question);

    // Either the questions or their order should be different
    expect(questions1).not.toEqual(questions2);
  });
});
