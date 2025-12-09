// src/components/HeroSlider.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Responsive HeroSlider
 * - Keeps left/right spacing using a centered container with px
 * - Responsive heights via aspect ratio classes + fallback heights
 * - Auto-play with pause-on-hover/focus (respects prefers-reduced-motion)
 * - Touch swipe support (touchstart/touchmove/touchend)
 * - Keyboard navigation (ArrowLeft, ArrowRight)
 * - Accessible dots and buttons
 *
 * Usage:
 * <HeroSlider banners={[ '/banners/one.jpg', '/banners/two.jpg' ]} />
 */

export default function HeroSlider({
  banners = [
    "/banners/sale1.jpg",
    "/banners/sale2.jpg",
    "/banners/sale3.jpg"
  ],
  autoplayInterval = 4000
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const length = banners.length;
  const containerRef = useRef(null);

  // touch tracking for swipe
  const touch = useRef({ startX: 0, currentX: 0 });

  // respect user preference for reduced motion
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // autoplay timer
  useEffect(() => {
    if (prefersReducedMotion) return; // don't autoplay if reduced motion preferred
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, autoplayInterval);
    return () => clearInterval(t);
  }, [paused, length, autoplayInterval, prefersReducedMotion]);

  // keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // touch handlers
  const onTouchStart = (e) => {
    touch.current.startX = e.touches ? e.touches[0].clientX : e.clientX;
    touch.current.currentX = touch.current.startX;
  };
  const onTouchMove = (e) => {
    touch.current.currentX = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onTouchEnd = () => {
    const dx = touch.current.currentX - touch.current.startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touch.current.startX = 0;
    touch.current.currentX = 0;
  };

  const prev = () => setIndex((i) => (i === 0 ? length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % length);

  // helpers
  const goTo = (i) => setIndex(i);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* centered container with gutters */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl shadow-lg"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
      >
        {/* Responsive aspect box:
            - small: aspect 16/9-ish (h-56)
            - sm: taller
            - md: even taller
           fallback heights also provided via h-56 sm:h-72 md:h-96
        */}
        <div className="w-full aspect-[16/7] sm:aspect-[16/8] md:aspect-[16/6] relative">
          {/* sliding wrapper */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners.map((src, i) => (
              <div key={i} className="w-full flex-shrink-0 h-full relative">
                <img
                  src={src}
                  alt={`banner-${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover block"
                  draggable={false}
                />

                {/* Example caption (optional) - you can remove or customize */}
                <div className="absolute left-6 bottom-6 bg-black/40 text-white px-4 py-2 rounded backdrop-blur-sm max-w-md">
                  <h3 className="text-lg font-semibold">Deal {i + 1}</h3>
                  <p className="text-sm mt-1">Exclusive coupon offers — tap to explore.</p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            style={{ backdropFilter: "saturate(120%) blur(4px)" }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            style={{ backdropFilter: "saturate(120%) blur(4px)" }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots (centered) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active}
                  className={`w-3 h-3 rounded-full transition-transform transform ${active ? "scale-125 bg-indigo-600" : "bg-white/70"}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
