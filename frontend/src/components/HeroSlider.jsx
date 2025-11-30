// src/components/HeroSlider.jsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  // Dummy banner images (replace with your own)
  const banners = [
    "/banners/sale1.jpg",
    "/banners/sale2.jpg",
    "/banners/sale3.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextSlide = () => setIndex((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg mt-4">
      {/* Container with fixed height per breakpoint */}
      <div
        className="w-full h-56 sm:h-72 md:h-96"
        style={{ position: "relative" }}
      >
        {/* Sliding inner wrapper */}
        <div
          className="w-full h-full flex transition-transform duration-700"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((src, i) => (
            <div key={i} className="w-full flex-shrink-0 h-full">
              {/* Image fills entire div and covers (no empty space) */}
              <img
                src={src}
                alt={`banner-${i}`}
                loading="lazy"
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${i === index ? "bg-indigo-600" : "bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
