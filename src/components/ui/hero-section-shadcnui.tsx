import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function HeroSectionShadcnUI() {
  const { isAuthenticated, loginWithDiscord } = useAuth();
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-[600px] flex-col items-center justify-center px-4 py-24 text-center"
    >
      <motion.h1
        variants={itemVariants}
        className="mb-8 text-5xl font-extrabold tracking-tight md:text-7xl text-white"
      >
        Support Tickets
        <br />
        <span className="text-white">
          Solved by AI
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-10 max-w-3xl text-xl md:text-2xl text-neutral-300 font-normal leading-relaxed"
      >
        Cyron Assistant combines professional Discord ticket management with an AI assistant that only answers from what you taught it. Set up in minutes, not days.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-5">
        <button
          onClick={() => {
            if (isAuthenticated) {
              navigate("/dashboard");
            } else {
              loginWithDiscord();
            }
          }}
          className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0433FF] px-8 py-4 text-base md:text-lg font-bold text-white hover:bg-[#0433FF]/90 shadow-lg shadow-[#0433FF]/25 transition-all cursor-pointer"
        >
          {isAuthenticated ? "Dashboard" : "Get Started"}
          <ArrowRight className="h-5 w-5" />
        </button>
        <button className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base md:text-lg font-bold text-white hover:bg-white/10 transition-all cursor-pointer">
          Docs
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-16 flex flex-wrap items-center justify-center gap-10 md:gap-14 text-base text-neutral-400"
      >
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">
            2,735
          </div>
          <div className="mt-1 font-medium">Servers</div>
        </div>
        <div className="hidden sm:block h-10 w-px bg-neutral-800" />
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">1,43,769</div>
          <div className="mt-1 font-medium">Ticket Handled</div>
        </div>
        <div className="hidden sm:block h-10 w-px bg-neutral-800" />
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">
            253
          </div>
          <div className="mt-1 font-medium">AI enabled servers</div>
        </div>
        <div className="hidden sm:block h-10 w-px bg-neutral-800" />
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">
            4s
          </div>
          <div className="mt-1 font-medium">Avg. response time</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
