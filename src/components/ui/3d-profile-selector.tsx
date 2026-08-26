import { cn } from "../../lib/utils";
import React, { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  Variants,
  MotionValue,
} from "framer-motion";
import { Plus, RefreshCw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaDiscord } from "react-icons/fa";
/* ---------- Types ---------- */

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 1, flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative h-[50px] w-full max-w-[420px] overflow-hidden rounded-[24px]">
      <div className="cyron-glass absolute inset-0 flex items-center gap-2.5 px-3.5 text-white transition-all duration-300 hover:border-amber-400/30">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search your server..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          className="transparent-input w-full border-0 bg-transparent text-[15px] text-white outline-none ring-0 placeholder:text-white/40 focus:border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}

export interface Guild {
  id: string | number;
  name: string;
  icon_url?: string | null;
  has_bot?: boolean;
  plan?: string;
}

interface ServerCardsProps {
  guilds: Guild[];
  onAddBot?: (guildId: string | number) => void;
}

/* ---------- Motion variants ---------- */

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/* ---------- Main component ---------- */

export default function ProfileSelect({ guilds = [], onAddBot }: ServerCardsProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) => {
    const rect = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  const installedServers = guilds.filter((g) => g.has_bot && g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const nonInstalledServers = guilds.filter((g) => !g.has_bot && g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      className="relative w-full text-neutral-50 selection:bg-white/20 mt-8"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="relative z-10 flex flex-col w-full"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >

        <motion.div
          variants={titleVariants}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 12,
            width: "100%",
            maxWidth: "100%",
            marginBottom: "3rem"
          }}
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button
            onClick={() => window.location.reload()}
            className="cyron-glass cyron-glass-hover flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-[24px]"
            title="Refresh servers"
          >
            <RefreshCw size={20} color="#ffffff" />
          </button>
        </motion.div>


        {/* Bot Installed Section */}
        {installedServers.length > 0 && (
          <div className="w-full mb-16">
            <motion.div variants={subtitleVariants} className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-300">
                Bot installed
              </h2>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                Click to open the dashboard.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start w-full"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15, delayChildren: 0.1 },
                },
              }}
            >
              {installedServers.map((guild) => (
                <HorizontalProfileCard
                  key={String(guild.id)}
                  guild={guild}
                  onManage={() => navigate(`/guilds/${guild.id}/settings`)}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* Non Installed Section */}
        {nonInstalledServers.length > 0 && (
          <div className="w-full">
            <motion.div variants={subtitleVariants} className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-400">
                Non installed servers
              </h2>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                Click to add the bot to these servers.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start w-full"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15, delayChildren: 0.1 },
                },
              }}
            >
              {nonInstalledServers.map((guild) => (
                <HorizontalProfileCard
                  key={String(guild.id)}
                  guild={guild}
                  onAddBot={onAddBot}
                />
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- Background spotlight ---------- */

function Spotlight({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.1),
    transparent 80%
  )`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100 transition-opacity duration-300"
      style={{ background }}
    />
  );
}

/* ---------- Horizontal Profile card ---------- */

function HorizontalProfileCard({ guild, onAddBot, onManage }: { guild: Guild; onAddBot?: (id: string | number) => void; onManage?: () => void }) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (guild.has_bot) {
      if (onManage) onManage();
      else navigate(`/guilds/${guild.id}/settings`);
    } else if (onAddBot) {
      onAddBot(guild.id);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={handleClick}
      className="group relative flex h-[120px] w-full max-w-[400px] cursor-pointer overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:border-amber-400/35 hover:bg-white/[0.08] hover:shadow-[0_0_32px_rgba(245,166,35,0.18)]"
    >
      <div className="flex h-full w-[35%] items-center justify-center border-r border-white/10 bg-black/25">
        {guild.icon_url ? (
          <img
            src={guild.icon_url}
            alt={guild.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${
              parseInt(String(guild.id)) % 2 !== 0 ? "bg-rose-500/80" : "bg-amber-500/80"
            }`}
          >
            <FaDiscord className="h-16 w-16 text-white drop-shadow-sm" />
          </div>
        )}
      </div>

      <div className="relative h-full w-[65%] overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center px-6 transition-transform duration-300 group-hover:-translate-y-full">
          <h3 className="line-clamp-2 font-display text-xl font-bold uppercase leading-none tracking-tight text-white">
            {guild.name}
          </h3>
          <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-amber-300/80">
            {guild.plan
              ? guild.plan.toUpperCase()
              : guild.has_bot
                ? "FREE"
                : "NOT INSTALLED"}
          </p>
        </div>

        <div className="absolute inset-0 flex translate-y-full items-center justify-center bg-gradient-to-r from-[#F5A623] to-[#ffd27a] transition-transform duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-tight text-[#0a0a0a]">
            {guild.has_bot ? "Manage" : "Add Bot"}
            <ArrowRight size={18} strokeWidth={3} color="#0a0a0a" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

