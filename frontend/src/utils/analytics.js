// src/utils/analytics.js
// Lightweight client-side analytics: stores events in localStorage and logs to console.
// Later you can POST these events to your backend or analytics provider.

const STORAGE_KEY = "coupon_analytics_events";

/** push an event object { type, couponId, meta } */
export function trackEvent(type, couponId = null, meta = {}) {
  const ev = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    type,
    couponId,
    meta,
    ts: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(ev);
    // keep only last 500 events to avoid bloat
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-500)));
  } catch (err) {
    console.error("Analytics store failed", err);
  }

  // also print to console for debugging during dev
  console.log("ANALYTICS", ev);
}

/** read stored events (for debugging / admin) */
export function readEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** clear local events (useful for dev) */
export function clearEvents() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
