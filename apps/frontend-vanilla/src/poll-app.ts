import type { Poll } from "@repo/models";

export class PollApp {
  private form: HTMLFormElement;
  private optionsContainer: HTMLDivElement;
  private addOptionBtn: HTMLButtonElement;
  private pollsList: HTMLDivElement;

  constructor() {
    this.form = document.getElementById("createPollForm") as HTMLFormElement;
    this.optionsContainer = document.getElementById(
      "optionsContainer",
    ) as HTMLDivElement;
    this.addOptionBtn = document.getElementById(
      "addOptionBtn",
    ) as HTMLButtonElement;
    this.pollsList = document.getElementById("pollsList") as HTMLDivElement;

    this.initializeEventListeners();
    this.loadPolls();
  }

  async loadPolls(): Promise<void> {
    try {
      const response = await fetch("/api/polls");
      const polls = await response.json();
      this.renderPolls(polls);
    } catch (error) {
      console.error("Failed to load polls:", error);
    }
  }

  private initializeEventListeners(): void {
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    this.addOptionBtn.addEventListener("click", () => this.addOptionInput());
  }

  private addOptionInput(): void {
    const optionInputs = this.optionsContainer.getElementsByTagName("input");
    if (optionInputs.length < 5) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Option ${optionInputs.length + 1}`;
      input.required = true;
      this.optionsContainer.appendChild(input);
    }

    this.addOptionBtn.style.display =
      optionInputs.length >= 4 ? "none" : "block";
  }

  private async handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();
    const questionInput = document.getElementById(
      "questionInput",
    ) as HTMLInputElement;
    const optionInputs = Array.from(
      this.optionsContainer.getElementsByTagName("input"),
    ) as HTMLInputElement[];

    const options = optionInputs
      .map((input) => input.value.trim())
      .filter((value) => value !== "");

    try {
      await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionInput.value,
          options,
        }),
      });

      await this.loadPolls();
      this.resetForm();
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  }

  private resetForm(): void {
    this.form.reset();
    this.optionsContainer.innerHTML =
      '<input type="text" placeholder="Option 1" required>';
    this.addOptionBtn.style.display = "block";
  }

  public async handleVote(pollId: string, optionId: string): Promise<void> {
    try {
      await fetch("/api/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionId }),
      });
      await this.loadPolls();
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  }

  private renderPolls(polls: Poll[]): void {
    const sortedPolls = [...polls].sort((a, b) => {
      const getTotalVotes = (poll: Poll) =>
        poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
      return getTotalVotes(b) - getTotalVotes(a);
    });

    this.pollsList.innerHTML = sortedPolls
      .map(
        (poll) => `
      <div class="poll-card">
        <h3>${this.escapeHtml(poll.question)}</h3>
        <div class="poll-options">
          ${poll.options
            .map(
              (option) => `
            <div class="poll-option">
              <span class="option-text">
                ${this.escapeHtml(option.text)} (${option.voteCount} votes)
              </span>
              <button onclick="pollApp.handleVote('${poll.id}', '${option.id}')">
                Vote
              </button>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `,
      )
      .join("");
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
