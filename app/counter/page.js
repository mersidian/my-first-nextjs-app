// app/counter/page.js
"use client";

import { useState } from 'react';

export default function CounterPage() {
  // Standard React state
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Interactive Counter</h1>
      <p>Current Count: <strong>{count}</strong></p>

      <button onClick={() => setCount(count + 1)}className="btn">Increment +</button>
    </div>
  );
}