import { useState, type ReactElement } from "react";

function App(): ReactElement {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>React + Vite Frontend</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
