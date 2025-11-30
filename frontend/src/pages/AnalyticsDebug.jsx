// src/pages/AnalyticsDebug.jsx
import React, { useState, useEffect } from "react";
import { readEvents, clearEvents } from "../utils/analytics";

export default function AnalyticsDebug() {
  const [events, setEvents] = useState([]);
  useEffect(() => setEvents(readEvents()), []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Analytics Debug</h2>
      <div className="my-4">
        <button onClick={() => { clearEvents(); setEvents([]); }} className="px-3 py-1 border rounded">Clear</button>
      </div>
      <pre className="bg-black text-white p-4 rounded max-h-[60vh] overflow-auto">
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  );
}
