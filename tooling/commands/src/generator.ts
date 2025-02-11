import type { CreatePollInput } from "@repo/models";
import { questions } from "./questions.ts";

function mulberry32(seed: number) {
  return () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export interface GeneratorOptions {
  count: number;
  seed?: number;
}

export function generatePolls(options: GeneratorOptions): CreatePollInput[] {
  const { count, seed } = options;
  const actualCount = Math.min(count, questions.length);

  const random = seed !== undefined ? mulberry32(seed) : Math.random;

  return [...questions]
    .sort(() => random() - 0.5)
    .slice(0, actualCount)
    .map(({ question, options }) => ({
      question,
      options,
    }));
}
