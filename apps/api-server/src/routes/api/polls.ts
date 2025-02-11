import { type FastifyPluginAsync } from "fastify";
import { type CreatePollInput, type VoteInput } from "@repo/models";

const polls: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/polls", async () => {
    return fastify.db.getPolls();
  });

  // Create new poll
  fastify.post<{ Body: CreatePollInput }>("/polls", async (request) => {
    return fastify.db.createPoll(request.body);
  });

  // Cast vote
  fastify.post<{ Body: VoteInput }>("/polls/vote", async (request) => {
    return fastify.db.vote(request.body);
  });
};

export default polls;
