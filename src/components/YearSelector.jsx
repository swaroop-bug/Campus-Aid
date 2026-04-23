// src/components/YearSelector.jsx
import React from "react";

export default function YearSelector({ selectedYear, onChange }) {
  return (
    <select value={selectedYear} onChange={(e) => onChange(e.target.value)}>
      <option value="1">Year 1</option>
      <option value="2">Year 2</option>
    </select>
  );
}
