import { useState, useRef } from "react";
import Home from "./pages/Home";
import { runResearch } from "./api/researchApi";
import "./index.css";

const STATES = {
  IDLE: "idle",
  SEARCHING: "searching",
  READING: "reading",
  SYNTHESIZING: "synthesizing",
  COMPLETED: "completed",
};

function App() {
  const [query, setQuery] = useState("");
  const [researchState, setResearchState] = useState(STATES.IDLE);
  const [result, setResult] = useState(null);

  // ⛔ keep track of timers
  const timersRef = useRef([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  async function handleRunResearch(submittedQuery) {
    const nextQuery = (submittedQuery ?? query).trim();
    if (!nextQuery) return;

    // 🔥 HARD RESET before new research
    clearTimers();
    setResult(null);
    setQuery(nextQuery);
    setResearchState(STATES.SEARCHING);

    // UX-only pacing (safe now)
    timersRef.current.push(
      setTimeout(() => setResearchState(STATES.READING), 800),
      setTimeout(() => setResearchState(STATES.SYNTHESIZING), 1600)
    );

    try {
      const data = await runResearch(nextQuery);
      setResult(data);
      setResearchState(STATES.COMPLETED);
    } catch (err) {
      console.error("Research failed:", err);
      setResearchState(STATES.IDLE);
    }
  }

  function handleReset() {
    clearTimers();
    setQuery("");
    setResult(null);
    setResearchState(STATES.IDLE);
  }

  return (
    <Home
      query={query}
      setQuery={setQuery}
      researchState={researchState}
      onRunResearch={handleRunResearch}
      result={result}
      onReset={handleReset}
    />
  );
}

export default App;
