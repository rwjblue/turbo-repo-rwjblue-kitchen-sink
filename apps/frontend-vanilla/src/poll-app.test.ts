import { describe, it, expect, vi, beforeEach } from "vitest";
import { PollApp } from "./poll-app.ts";
import type { Poll } from "@repo/models";

describe("PollApp", () => {
  let pollApp: PollApp;

  const mockPoll: Poll = {
    id: "1",
    question: "Test Question?",
    createdAt: "2024-01-01T00:00:00.000Z",
    options: [
      { id: "1", text: "Option 1", voteCount: 0 },
      { id: "2", text: "Option 2", voteCount: 5 },
    ],
  };

  beforeEach(() => {
    pollApp = new PollApp();
  });

  it("initializes with required DOM elements", () => {
    expect(document.getElementById("createPollForm")).toBeTruthy();
    expect(document.getElementById("optionsContainer")).toBeTruthy();
    expect(document.getElementById("addOptionBtn")).toBeTruthy();
    expect(document.getElementById("pollsList")).toBeTruthy();
  });

  it("adds new option input when clicking add option button", () => {
    const addOptionBtn = document.getElementById(
      "addOptionBtn",
    ) as HTMLButtonElement;
    const optionsContainer = document.getElementById(
      "optionsContainer",
    ) as HTMLDivElement;

    addOptionBtn.click();
    expect(optionsContainer.getElementsByTagName("input")).toHaveLength(2);

    // Test max options limit
    for (let i = 0; i < 5; i++) {
      addOptionBtn.click();
    }
    expect(optionsContainer.getElementsByTagName("input")).toHaveLength(5);
    expect(addOptionBtn.style.display).toBe("none");
  });

  it("handles form submission", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    global.fetch = mockFetch;

    const form = document.getElementById("createPollForm") as HTMLFormElement;
    const questionInput = document.getElementById(
      "questionInput",
    ) as HTMLInputElement;
    const optionInput = document.querySelector(
      "#optionsContainer input",
    ) as HTMLInputElement;

    questionInput.value = "Test Question?";
    optionInput.value = "Test Option";

    form.dispatchEvent(new Event("submit"));

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "Test Question?",
          options: ["Test Option"],
        }),
      });
    });
  });

  it("renders polls correctly", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockPoll]),
    });
    global.fetch = mockFetch;

    await pollApp.loadPolls();

    const pollsList = document.getElementById("pollsList");
    expect(pollsList?.innerHTML).toContain("Test Question?");
    expect(pollsList?.innerHTML).toContain("Option 1 (0 votes)");
    expect(pollsList?.innerHTML).toContain("Option 2 (5 votes)");
  });

  it("handles voting", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPoll]),
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPoll]),
      });
    global.fetch = mockFetch;

    await pollApp.handleVote("1", "1");

    expect(mockFetch).toHaveBeenCalledWith("/api/polls/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId: "1", optionId: "1" }),
    });
  });
});
