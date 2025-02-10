import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setupServer,
  teardownServer,
  type TestContextWithServer,
} from "../helper.ts";

describe("example route", () => {
  beforeEach(setupServer);
  afterEach(teardownServer);

  it<TestContextWithServer>("example is loaded", async ({ server }) => {
    const res = await server.inject({
      url: "/example",
    });
    expect(res.payload).toBe("this is an example");
  });
});
