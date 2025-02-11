import { Command } from "commander";
import { setup } from "@repo/db";
import { generatePolls } from "./generator.ts";

export interface SeedOptions {
  count: number;
  dbPath?: string;
  seed?: number;
}

export async function seed(options: SeedOptions): Promise<void> {
  // Setup database
  const db = setup({
    filename: options.dbPath || ":memory:",
  });

  // Generate polls
  const polls = generatePolls({
    count: options.count,
    seed: options.seed,
  });

  // Create polls in database
  for (const poll of polls) {
    db.createPoll(poll);
  }

  // Log results
  const savedPolls = db.getPolls();
  console.log(`Successfully created ${savedPolls.length} polls:`);
  console.log(JSON.stringify(savedPolls, null, 2));
}

export function cli(argv: string[]): void {
  const program = new Command();

  program
    .name("poll-seed")
    .description("Generate seed data for the polling application")
    .version("0.0.1")
    .option("-c, --count <number>", "number of polls to generate", "5")
    .option("-d, --db-path <path>", "database file path")
    .option("-s, --seed <number>", "random seed for reproducible generation")
    .action(async (options) => {
      try {
        await seed({
          count: parseInt(options.count, 10),
          dbPath: options.dbPath,
          seed:
            options.seed !== undefined ? parseInt(options.seed, 10) : undefined,
        });
      } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
      }
    });

  program.parse(argv);
}
