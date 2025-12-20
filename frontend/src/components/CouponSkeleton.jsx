// src/components/CouponSkeleton.jsx
import React from "react";

export default function CouponSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[260px] rounded-2xl animate-pulse"
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="p-4 space-y-4">
            <div className="h-4 w-2/3 bg-[var(--bg-muted)] rounded" />
            <div className="h-3 w-1/3 bg-[var(--bg-muted)] rounded" />

            <div className="h-8 w-1/2 bg-[var(--bg-muted)] rounded mt-6" />

            <div className="flex justify-between items-end mt-10">
              <div className="h-8 w-24 bg-[var(--bg-muted)] rounded-lg" />
              <div className="h-3 w-20 bg-[var(--bg-muted)] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
