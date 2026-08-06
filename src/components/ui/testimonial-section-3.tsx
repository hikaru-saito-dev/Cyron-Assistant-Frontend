import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const testimonials = [
  {
    id: "1",
    name: "Saas server",
    role: "Community Manager",
    quote:
      "We went from waking up to a wall of unanswered tickets to most common questions being answered before a mod even sees them.",
  },
  {
    id: "2",
    name: "Gaming community",
    role: "Head of support",
    quote:
      "Our staff still handles edge cases, but Cyron Assistant quietly takes care of 60 - 70% of the ticket volume.",
  },
  {
    id: "3",
    name: "Premium discord",
    role: "Server owner",
    quote:
      "Setup was faster than expected. Once we tuned the prompts and limits, it felt like adding another reliable staff member.",
  },
];

export default function Testimonial3() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const visibleItems = useMemo(() => {
    const total = testimonials.length;
    const leftIndex = (currentIndex - 1 + total) % total;
    const centerIndex = currentIndex;
    const rightIndex = (currentIndex + 1) % total;

    return [
      { ...testimonials[leftIndex], position: "left" },
      { ...testimonials[centerIndex], position: "center" },
      { ...testimonials[rightIndex], position: "right" },
    ];
  }, [currentIndex]);

  return (
    <section
      className="w-full py-20 bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ "--color-primary": "#003AF9" } as React.CSSProperties}
    >
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Trusted By The
          <br />
          Best People
        </h2>
      </div>

      <div className="relative w-full max-w-7xl px-4 flex items-stretch justify-center">
        <div className="flex flex-row items-stretch justify-center w-full">
          {visibleItems.map((item, index) => {
            const isCenter = item.position === "center";

            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="hidden md:block w-[10px] sm:w-[20px] relative shrink-0">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] text-neutral-300 dark:text-neutral-700 opacity-50 h-full w-full" />
                  </div>
                )}

                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  style={{ willChange: "transform, opacity" }}
                  className={cn(
                    "relative flex flex-col justify-between border p-8 w-full md:w-[300px] shrink-0 rounded-none overflow-hidden",
                    isCenter
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white z-20"
                      : "hidden md:flex bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 z-0",
                  )}
                >
                  {!isCenter && item.position === "left" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent z-10 pointer-events-none transition-all duration-300" />
                  )}
                  {!isCenter && item.position === "right" && (
                    <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/40 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent z-10 pointer-events-none transition-all duration-300" />
                  )}

                  <div
                    className={cn(
                      "text-xl md:text-[1.6rem] font-medium mb-8",
                      !isCenter && "blur-[1px] opacity-70",
                    )}
                  >
                    "{item.quote}"
                  </div>

                  <div 
                    className={cn(
                      "flex flex-col text-left mt-auto pt-6 border-t",
                      isCenter ? "border-white/20" : "border-neutral-200 dark:border-neutral-800"
                    )}
                  >
                    <span
                      className={cn(
                        "font-bold text-lg",
                        isCenter
                          ? "text-white"
                          : "text-neutral-900 dark:text-white",
                      )}
                    >
                      {item.name}
                    </span>
                    <span
                      className={cn(
                        "text-sm mt-1",
                        isCenter ? "text-blue-100" : "text-neutral-500",
                      )}
                    >
                      {item.role}
                    </span>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-12 bg-transparent">
        <button
          onClick={handlePrev}
          className="group p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Previous testimonial"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-400 dark:text-neutral-400 group-hover:text-[var(--color-primary)] transition-colors" />
        </button>
        <button
          onClick={handleNext}
          className="group p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Next testimonial"
        >
          <ArrowRight className="w-6 h-6 text-neutral-400 dark:text-neutral-400 group-hover:text-[var(--color-primary)] transition-colors" />
        </button>
      </div>
    </section>
  );
}
