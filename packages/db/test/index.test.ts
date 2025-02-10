import { describe, it, expect, beforeEach } from 'vitest';
import { setup, type Database } from '../src/index.ts';

describe('Database', () => {
  let db: Database;

  beforeEach(() => {
    db = setup({ memory: true });
  });

  describe('createPoll', () => {
    it('creates a poll with valid options', () => {
      const poll = db.createPoll({
        question: 'Favorite color?',
        options: ['Red', 'Blue', 'Green']
      });

      expect(poll.question).toBe('Favorite color?');
      expect(poll.options).toHaveLength(3);
      expect(poll.options[0].voteCount).toBe(0);
    });

    it('throws error when options are out of range', () => {
      expect(() =>
        db.createPoll({
          question: 'Invalid poll',
          options: []
        })
      ).toThrow('Poll must have between 1 and 5 options');
    });
  });

  describe('vote', () => {
    it('increments vote count for valid option', () => {
      const poll = db.createPoll({
        question: 'Test poll',
        options: ['Option 1', 'Option 2']
      });

      const updatedPoll = db.vote({
        pollId: poll.id,
        optionId: poll.options[0].id
      });

      expect(updatedPoll?.options[0].voteCount).toBe(1);
      expect(updatedPoll?.options[1].voteCount).toBe(0);
    });
  });

  describe('getPolls', () => {
    it('returns polls ordered by vote count', async () => {
      const poll1 = db.createPoll({
        question: 'First poll',
        options: ['A', 'B']
      });

      const poll2 = db.createPoll({
        question: 'Second poll',
        options: ['C', 'D']
      });

      db.vote({ pollId: poll2.id, optionId: poll2.options[0].id });

      const polls = db.getPolls();
      expect(polls[0].id).toBe(poll2.id);
      expect(polls[1].id).toBe(poll1.id);
    });
  });
});
