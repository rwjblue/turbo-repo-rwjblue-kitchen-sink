import "@testing-library/jest-dom/vitest";
import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock fetch globally
global.fetch = vi.fn();

// Create mock DOM elements
beforeEach(() => {
  document.body.innerHTML = `
    <div class="root">
      <div class="container">
        <form id="createPollForm" class="poll-form">
          <input type="text" id="questionInput" placeholder="Enter your question" required>
          <div id="optionsContainer" class="options-container">
            <input type="text" placeholder="Option 1" required>
          </div>
          <div class="button-group">
            <button type="button" id="addOptionBtn">Add Option</button>
            <button type="submit">Create Poll</button>
          </div>
        </form>
        <div id="pollsList" class="poll-list"></div>
      </div>
    </div>
  `;
});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  document.body.innerHTML = "";
});
