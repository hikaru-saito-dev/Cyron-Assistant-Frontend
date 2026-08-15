import { cn } from "../../lib/utils";
import React, { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { Plus, RefreshCw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    <div style={{ width: 420, maxWidth: "100%", height: 50, borderRadius: 64, overflow: "hidden", position: "relative", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          padding: "0 13px",
          gap: 10,
          color: "#ffffff",
        }}
      >
        <SearchIcon />
        <input
          type="text"
          placeholder="Search your server..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          className="transparent-input bg-transparent border-0 ring-0 outline-none focus:ring-0 focus:border-0 focus:outline-none placeholder:text-white/50"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 16,
            lineHeight: "20px",
            color: "#ffffff",
            width: "100%",
            boxShadow: "none"
          }}
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 shadow hover:bg-white/20 transition-colors"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 50,
              borderRadius: 24,
              cursor: "pointer",
              flexShrink: 0,
            }}
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
      className="group relative flex w-full max-w-[400px] h-[120px] overflow-hidden rounded-[20px] bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 hover:border-white/30 cursor-pointer shadow-lg"
    >
      {/* Left side: Avatar */}
      <div className="w-[35%] h-full flex items-center justify-center bg-black/20 border-r-2 border-white/20">
        {guild.icon_url ? (
          <img src={guild.icon_url} alt={guild.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <span className="text-5xl font-black text-white select-none tracking-tighter">{guild.name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* Right side: Name and Plan */}
      <div className="relative w-[65%] h-full overflow-hidden">
        {/* Default State */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 transition-transform duration-300 group-hover:-translate-y-full">
          <h3 
            className="line-clamp-2 text-2xl font-bold text-white uppercase tracking-tighter leading-none"
            style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
          >
            {guild.name}
          </h3>
          <p className="mt-2 text-sm font-bold text-white/70 tracking-wide">
            {guild.plan ? guild.plan.toUpperCase() : (guild.has_bot ? 'FREE' : 'NOT INSTALLED')}
          </p>
        </div>

        {/* Hover State */}
        <div 
          className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0"
          style={{ backgroundColor: '#ffffff' }}
        >
          <span 
            className="font-bold uppercase tracking-tighter text-xl flex items-center gap-2" 
            style={{ color: '#000000', fontFamily: 'Impact, "Arial Black", sans-serif' }}
          >
            {guild.has_bot ? "Manage" : "Add Bot"} 
            <ArrowRight size={20} strokeWidth={4} color="#000000" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

