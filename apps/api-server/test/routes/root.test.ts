import { describe, it, expect, afterEach, beforeEach } from "vitest";
import {
  setupServer,
  teardownServer,
  type TestContextWithServer,
} from "../helper.ts";

describe("root route", () => {
  beforeEach(setupServer);
  afterEach(teardownServer);

  it<TestContextWithServer>("default root route", async ({ server }) => {
    const res = await server.inject({
      url: "/",
    });
    expect(JSON.parse(res.payload)).toEqual({ root: true });
  });
});
