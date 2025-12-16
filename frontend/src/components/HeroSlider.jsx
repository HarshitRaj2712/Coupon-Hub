// src/components/HeroSlider.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * HeroSlider (Compact Height)
 * - Fixed small height instead of aspect-ratio
 * - Prevents oversized / wide hero
 */

export default function HeroSlider({
  banners = [
    "/banners/sale1.jpg",
    "/banners/sale2.jpg",
    "/banners/sale3.jpg",
  ],
  autoplayInterval = 4000,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const length = banners.length;

  const touch = useRef({ startX: 0, currentX: 0 });

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % length),
      autoplayInterval
    );
    return () => clearInterval(t);
  }, [paused, length, autoplayInterval]);

  /* ================= TOUCH ================= */
  const onTouchStart = (e) => {
    touch.current.startX = e.touches[0].clientX;
    touch.current.currentX = touch.current.startX;
  };

  const onTouchMove = (e) => {
    touch.current.currentX = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const dx = touch.current.currentX - touch.current.startX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
    touch.current.startX = 0;
    touch.current.currentX = 0;
  };

  const prev = () => setIndex((i) => (i === 0 ? length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % length);
  const goTo = (i) => setIndex(i);

  /* ================= UI ================= */
  return (
    <div className="w-full px-2 sm:px-3 lg:px-4 mt-6">
      <div
        className="relative overflow-hidden rounded-xl shadow-md"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* FIXED SMALL HEIGHT */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[360px]">
          {/* SLIDES */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners.map((src, i) => (
              <div key={i} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={src}
                  alt={`banner-${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* LEFT ARROW */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-2 rounded-full shadow"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-2 rounded-full shadow"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>

          {/* DOTS */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full ${
                  i === index
                    ? "bg-[var(--accent)] scale-125"
                    : "bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
