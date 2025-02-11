import { test, expect } from "@playwright/test";

test.describe("React App", () => {
  test.beforeEach(async ({ page }) => {
    // Assuming your app runs on localhost:5173 (default Vite dev server)
    await page.goto("http://localhost:5173/");
  });

  test("should display the correct heading", async ({ page }) => {
    const heading = page.getByRole("heading", {
      name: "React + Vite Frontend",
    });
    await expect(heading).toBeVisible();
  });

  test("should increment counter when button is clicked", async ({ page }) => {
    const button = page.getByRole("button");

    // Check initial state
    await expect(button).toHaveText("Count is 0");

    // Click and verify increment
    await button.click();
    await expect(button).toHaveText("Count is 1");

    // Click again to ensure counter keeps incrementing
    await button.click();
    await expect(button).toHaveText("Count is 2");
  });

  test("should display HMR instruction text", async ({ page }) => {
    const codeElement = page.getByText("src/App.tsx", { exact: true });
    await expect(codeElement).toBeVisible();

    const instructionText = page.getByText("Edit");
    await expect(instructionText).toBeVisible();
  });
});
