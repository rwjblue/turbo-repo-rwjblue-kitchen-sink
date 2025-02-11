import { useState, type ReactElement } from "react";

interface CreatePollFormProps {
  onPollCreated: () => void;
}

export function CreatePollForm({ onPollCreated }: CreatePollFormProps): ReactElement {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = options.filter(opt => opt.trim() !== "");

    const response = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options: filteredOptions }),
    });

    if (response.ok) {
      setQuestion("");
      setOptions([""]);
      onPollCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        required
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${index + 1}`}
        />
      ))}
      {options.length < 5 && (
        <button
          type="button"
          onClick={() => setOptions([...options, ""])}
        >
          Add Option
        </button>
      )}
      <button type="submit">Create Poll</button>
    </form>
  );
}
