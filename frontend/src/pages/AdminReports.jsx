// src/pages/AdminReports.jsx
import React, { useEffect, useState } from "react";
import dummyCoupons from "../data/dummyCoupons";
import toast from "react-hot-toast";
import { readEvents, clearEvents, trackEvent } from "../utils/analytics";

/**
 * AdminReports
 * - Shows reported coupons (from localStorage keys coupon_reported_<id>)
 * - Shows working counts (coupon_works_<id>)
 * - Allows clearing report / resetting working count
 * - Shows raw analytics events and allows clearing them
 *
 * Note: This is frontend-only and reads data from localStorage.
 */

function getReportedStatus(id) {
  try {
    return localStorage.getItem(`coupon_reported_${id}`) === "1";
  } catch {
    return false;
  }
}

function getWorkingCount(id) {
  try {
    return parseInt(localStorage.getItem(`coupon_works_${id}`) || "0", 10);
  } catch {
    return 0;
  }
}

function clearReportFor(id) {
  try {
    localStorage.removeItem(`coupon_reported_${id}`);
    trackEvent("admin_clear_report", id, {});
    return true;
  } catch {
    return false;
  }
}

function resetWorkingCountFor(id) {
  try {
    localStorage.removeItem(`coupon_works_${id}`);
    trackEvent("admin_reset_works", id, {});
    return true;
  } catch {
    return false;
  }
}

export default function AdminReports() {
  const [reportedList, setReportedList] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    // Build list of coupons that have report flag set or have non-zero working count
    const list = dummyCoupons.map(c => {
      const id = c._id;
      return {
        ...c,
        reported: getReportedStatus(id),
        workingCount: getWorkingCount(id)
      };
    }).filter(c => c.reported || c.workingCount > 0);

    setReportedList(list);
    setEvents(readEvents());
  }

  const onClearReport = (id) => {
    const ok = clearReportFor(id);
    if (ok) {
      toast.success("Report cleared");
      loadData();
    } else {
      toast.error("Failed to clear report");
    }
  };

  const onResetWorks = (id) => {
    const ok = resetWorkingCountFor(id);
    if (ok) {
      toast.success("Working count reset");
      loadData();
    } else {
      toast.error("Failed to reset");
    }
  };

  const onClearAllEvents = () => {
    clearEvents();
    setEvents([]);
    toast.success("Cleared analytics events");
  };

  const onResetAll = () => {
    // WARNING: destructive; clears all report/work keys for known coupons
    dummyCoupons.forEach(c => {
      try {
        localStorage.removeItem(`coupon_reported_${c._id}`);
        localStorage.removeItem(`coupon_works_${c._id}`);
      } catch {}
    });
    clearEvents();
    loadData();
    toast.success("Reset reports and working counts");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin / Reports</h1>
        <div className="flex gap-2">
          <button onClick={onClearAllEvents} className="px-3 py-1 border rounded">Clear Events</button>
          <button onClick={onResetAll} className="px-3 py-1 bg-red-500 text-white rounded">Reset All</button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Reported Coupons & Working Counts</h2>
        {reportedList.length === 0 ? (
          <div className="text-gray-500">No reported coupons or activity found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportedList.map(c => (
              <div key={c._id} className="bg-white border rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-semibold">{c.title || c.store}</div>
                  <div className="text-xs text-gray-500">{c.store} • Code: <span className="font-mono">{c.code}</span></div>
                  <div className="mt-2 text-sm">
                    {c.reported && <span className="mr-2 text-red-600">Reported</span>}
                    <span className="text-gray-600">Working: <strong>{c.workingCount}</strong></span>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button onClick={() => onClearReport(c._id)} className="px-3 py-1 border rounded text-sm">Clear Report</button>
                  <button onClick={() => onResetWorks(c._id)} className="px-3 py-1 border rounded text-sm">Reset Working</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Analytics Events (latest first)</h2>
        <div className="mb-3 text-sm text-gray-500">
          Count: <strong>{events.length}</strong>
        </div>

        {events.length === 0 ? (
          <div className="text-gray-500">No analytics events found.</div>
        ) : (
          <div className="bg-black text-white rounded p-3 max-h-[50vh] overflow-auto">
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(events.slice().reverse(), null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
