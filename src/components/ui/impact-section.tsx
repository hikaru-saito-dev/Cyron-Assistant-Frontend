"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const impactCards = [
  {
    id: 0,
    metric: "2,735",
    title: "Servers",
    description:
      "Trusted by thousands of Discord communities to handle their support needs efficiently and professionally.",
    image:
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#CCFF00]",
    text: "text-[#111111]",
    isFeature: true,
  },
  {
    id: 1,
    metric: "1,43,769",
    title: "Tickets Handled",
    description:
      "Successfully processed and resolved hundreds of thousands of user inquiries across all our active communities.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#B8E8FF]",
    text: "text-[#111111]",
  },
  {
    id: 2,
    metric: "253",
    title: "AI enabled servers",
    description:
      "Pioneering communities that have fully automated their support with our intelligent context-aware AI.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#222222]",
    text: "text-[#ffffff]",
  },
  {
    id: 3,
    metric: "4s",
    title: "Avg. response time",
    description:
      "Lightning-fast AI responses ensure your users get the help they need instantly, 24/7 without delays.",
    image:
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#FF5CBA]",
    text: "text-[#111111]",
  },
];

export default function ImpactSection() {
  const [openCard, setOpenCard] = useState(0);

  return (
    <section className="w-full bg-[#f3f3f3] dark:bg-[#000000] py-12 sm:py-16 md:py-20">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-start justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-[620px]">
            <p className="text-[11px] tracking-[2px] uppercase font-semibold text-[#111111] dark:text-[#a0a0a0] mb-4">
              Platform Stats
            </p>
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] leading-[1.05] font-semibold text-[#111111] dark:text-white">
              Results that speak for themselves
            </h2>
            <p className="mt-4 text-[14px] sm:text-[15px] text-[#5f6670] dark:text-[#94a3b8] leading-[1.7] max-w-[560px]">
              Cyron Assistant is transforming support across Discord communities with measurable, real-world impact.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-0">
          {impactCards.map((card, idx) => {
            const isOpen = openCard === idx;
            const closedHeights = [280, 330, 390, 430];
            const targetHeight = isOpen ? 460 : closedHeights[idx];

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setOpenCard(idx)}
                onFocus={() => setOpenCard(idx)}
                onClick={() => setOpenCard(idx)}
                tabIndex={0}
                animate={{ flex: isOpen ? 4.8 : 1.5 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className={`${card.bg} ${card.text} relative overflow-hidden border border-[#ececec] dark:border-slate-800 h-[360px] md:h-auto cursor-pointer rounded-2xl md:rounded-none ${idx === 0 ? "md:rounded-l-2xl" : ""} ${idx === impactCards.length - 1 ? "md:rounded-r-2xl" : ""}`}
              >
                <motion.div
                  animate={{ height: targetHeight }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="h-full"
                >
                  {isOpen ? (
                    <div className="h-full p-6 sm:p-8 md:p-10 flex flex-col">
                      {card.isFeature ? (
                        <div className="max-w-[280px]">
                          <h3 className="text-[28px] sm:text-[32px] md:text-[36px] leading-[1.05] font-semibold mb-4">
                            Global
                            <br />
                            Reach
                          </h3>
                          <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.6] opacity-90 mb-4">
                            {card.description}
                          </p>
                        </div>
                      ) : (
                        <div className="max-w-[300px]">
                          <p className="text-[10px] tracking-[1.3px] uppercase font-semibold opacity-80">
                            Platform Stat
                          </p>
                          <h3 className="mt-2 text-[22px] sm:text-[26px] md:text-[30px] leading-[1.08] font-semibold">
                            {card.title}
                          </h3>
                          <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.6] opacity-90">
                            {card.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1.05fr_1fr] gap-4 flex-1 items-start">
                        <div className="self-start sm:self-end">
                          <p className="text-[56px] sm:text-[62px] md:text-[72px] font-semibold leading-none">
                            {card.metric}
                          </p>
                          <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold">
                            {card.title}
                          </p>
                        </div>

                        <div
                          className={`relative w-full rounded-sm overflow-hidden border border-black/10 flex items-center justify-center ${
                            card.isFeature ? "bg-black/5" : ""
                          } ${
                            card.isFeature
                              ? "h-[160px] sm:h-[180px] md:h-[200px]"
                              : "h-[160px] sm:h-[180px] md:h-[200px]"
                          }`}
                        >
                          {card.isFeature ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 127.14 96.36"
                              className="w-24 h-24 sm:w-32 sm:h-32 text-[#111111] opacity-90 transition-transform duration-500 hover:scale-110"
                              fill="currentColor"
                            >
                              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c0,0,.04-.06.05-.09A71.09,71.09,0,0,0,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91,65.69,84.69,65.69Z" />
                            </svg>
                          ) : (
                            <img
                              src={card.image}
                              alt={card.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-5 sm:p-6 md:p-7 flex flex-col justify-between">
                      <div />
                      <div>
                        <p className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold leading-none">
                          {card.metric}
                        </p>
                        <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold max-w-[120px]">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
