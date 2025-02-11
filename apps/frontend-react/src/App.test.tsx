import { describe, beforeEach, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App.tsx";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("App", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // Mock initial polls fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it("renders main heading", () => {
    render(<App />);
    expect(screen.getByText("Poll Creator & Voting App")).toBeInTheDocument();
  });

  it("fetches polls on mount", async () => {
    render(<App />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/polls");
    });
  });
});
