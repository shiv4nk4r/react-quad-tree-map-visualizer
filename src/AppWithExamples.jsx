import React, { useState } from "react";
import PolkaDotGenerator from "./components/PolkaDot/PolkaDotGeneratorRefactored";
import {
  RectangleExample,
  StarExample,
  TextExample,
  MixedExample,
} from "./examples/QuadtreeExamples";
import "./App.css";

const examples = [
  { key: "polkadots", label: "Polka Dots", component: PolkaDotGenerator },
  { key: "rectangles", label: "Rectangles", component: RectangleExample },
  { key: "stars", label: "Stars", component: StarExample },
  { key: "text", label: "Text Labels", component: TextExample },
  { key: "mixed", label: "Mixed Elements", component: MixedExample },
];

function App() {
  const [selectedExample, setSelectedExample] = useState("polkadots");

  const CurrentComponent =
    examples.find((ex) => ex.key === selectedExample)?.component ||
    PolkaDotGenerator;

  return (
    <div className="App">
      {/* Example Selector */}
      <div className="example-selector">
        <label htmlFor="example-select">Choose Example: </label>
        <select
          id="example-select"
          value={selectedExample}
          onChange={(e) => setSelectedExample(e.target.value)}
          className="example-select-input"
        >
          {examples.map((example) => (
            <option key={example.key} value={example.key}>
              {example.label}
            </option>
          ))}
        </select>
      </div>

      {/* Current Example Component */}
      <div className="example-container">
        <CurrentComponent />
      </div>
    </div>
  );
}

export default App;
