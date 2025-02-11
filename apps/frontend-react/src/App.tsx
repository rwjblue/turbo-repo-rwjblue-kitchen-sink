import { useState, useEffect, type ReactElement } from "react";
import { CreatePollForm } from "./components/CreatePollForm.tsx";
import { PollList } from "./components/PollList.tsx";
import type { Poll } from "@repo/models";

function App(): ReactElement {
  const [polls, setPolls] = useState<Poll[]>([]);

  const fetchPolls = async () => {
    const response = await fetch("/api/polls");
    const data = await response.json();
    setPolls(data);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handlePollCreated = async () => {
    await fetchPolls();
  };

  const handleVote = async () => {
    await fetchPolls();
  };

  return (
    <div className="container">
      <h1>Poll Creator & Voting App</h1>
      <CreatePollForm onPollCreated={handlePollCreated} />
      <PollList polls={polls} onVote={handleVote} />
    </div>
  );
}

export default App;
