import { test, expect } from "@playwright/test";

test.describe("Polling Application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("complete poll creation and voting flow", async ({ page }) => {
    // Verify initial page load
    await expect(page.getByRole("heading", { name: "Poll Creator & Voting App" })).toBeVisible();

    // Create a new poll
    await page.getByPlaceholder("Enter your question").fill("What's your favorite color?");
    await page.getByPlaceholder("Option 1").fill("Blue");
    await page.getByText("Add Option").click();
    await page.getByPlaceholder("Option 2").fill("Red");
    await page.getByText("Create Poll").click();

    // Verify poll appears in list
    await expect(page.getByText("What's your favorite color?")).toBeVisible();
    await expect(page.getByText("Blue (0 votes)")).toBeVisible();
    await expect(page.getByText("Red (0 votes)")).toBeVisible();

    // Cast a vote
    const voteButtons = page.getByRole("button", { name: "Vote" });
    await voteButtons.first().click();

    // Verify vote count updated
    await expect(page.getByText("Blue (1 votes)")).toBeVisible();
  });

  test("poll form validation", async ({ page }) => {
    // Try to submit empty form
    await page.getByText("Create Poll").click();

    // Verify form validation (HTML5 validation message should appear)
    const questionInput = page.getByPlaceholder("Enter your question");
    await expect(questionInput).toHaveAttribute("required", "");

    // Try to add more than 5 options
    for (let i = 0; i < 6; i++) {
      const addButton = page.getByText("Add Option");
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }

    // Verify maximum 5 options
    const optionInputs = await page.getByPlaceholder(/Option \d/).all();
    expect(optionInputs.length).toBe(5);
  });

  test("polls are sorted by votes", async ({ page }) => {
    // Create first poll
    await page.getByPlaceholder("Enter your question").fill("First Poll");
    await page.getByPlaceholder("Option 1").fill("Option A");
    await page.getByText("Create Poll").click();

    // Create second poll
    await page.getByPlaceholder("Enter your question").fill("Second Poll");
    await page.getByPlaceholder("Option 1").fill("Option B");
    await page.getByText("Create Poll").click();

    // Vote on second poll multiple times
    const polls = await page.getByRole("heading", { level: 3 }).all();
    const secondPollVoteButton = polls[1].locator('xpath=..//*[text()="Vote"]');
    await secondPollVoteButton.click();
    await secondPollVoteButton.click();

    // Verify second poll moves to top
    const updatedPolls = await page.getByRole("heading", { level: 3 }).all();
    await expect(updatedPolls[0]).toHaveText("Second Poll");
  });

  test("poll persistence after page reload", async ({ page }) => {
    // Create a poll
    await page.getByPlaceholder("Enter your question").fill("Persistent Poll");
    await page.getByPlaceholder("Option 1").fill("Option X");
    await page.getByText("Create Poll").click();

    // Vote on the poll
    await page.getByRole("button", { name: "Vote" }).click();

    // Reload page
    await page.reload();

    // Verify poll and votes persist
    await expect(page.getByText("Persistent Poll")).toBeVisible();
    await expect(page.getByText("Option X (1 votes)")).toBeVisible();
  });
});
