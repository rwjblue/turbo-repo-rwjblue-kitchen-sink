import type { Poll, CreatePollInput, VoteInput } from '@repo/models';

export class PollStore {
  private polls: Poll[] = [];

  async getPolls(): Promise<Poll[]> {
    return [...this.polls].sort((a, b) => {
      const getTotalVotes = (poll: Poll): number =>
        poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
      return getTotalVotes(b) - getTotalVotes(a);
    });
  }

  async createPoll(data: CreatePollInput): Promise<Poll> {
    const poll: Poll = {
      id: crypto.randomUUID(),
      question: data.question,
      createdAt: new Date().toISOString(),
      options: data.options.map(text => ({
        id: crypto.randomUUID(),
        text,
        voteCount: 0
      }))
    };

    this.polls.push(poll);
    return poll;
  }

  async vote(data: VoteInput): Promise<Poll | null> {
    const poll = this.polls.find(p => p.id === data.pollId);
    if (!poll) return null;

    const option = poll.options.find(o => o.id === data.optionId);
    if (!option) return null;

    option.voteCount++;
    return poll;
  }
}
