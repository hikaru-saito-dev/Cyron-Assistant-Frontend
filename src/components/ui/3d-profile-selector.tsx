import { cn } from "../../lib/utils";
import React, { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "@/components/ui/profile-card";
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
        className="bg-[#E63946]/70 backdrop-blur-lg border border-white/20 shadow"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          padding: "0 13px",
          gap: 10,
          color: "#000000",
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
          className="transparent-input force-black-text bg-transparent border-0 ring-0 outline-none focus:ring-0 focus:border-0 focus:outline-none"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 16,
            lineHeight: "20px",
            color: "#000000",
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
      className="relative min-h-screen w-full overflow-hidden bg-transparent text-neutral-50 selection:bg-white/20 pb-20"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center pt-24 px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-8 text-center text-5xl font-bold tracking-tighter sm:text-7xl"
          variants={titleVariants}
        >
          Select your server
        </motion.h1>

        <motion.div
          variants={titleVariants}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: "auto",
            maxWidth: "100%",
            margin: "0 auto",
            marginBottom: "3rem"
          }}
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button
            onClick={() => window.location.reload()}
            className="bg-[#E63946]/70 backdrop-blur-lg border border-white/20 shadow hover:bg-[#E63946]/90 transition-colors"
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
          <div className="w-full max-w-6xl mb-16">
            <motion.h2
              className="mb-8 text-2xl font-semibold text-neutral-300 ml-4 md:ml-12"
              variants={subtitleVariants}
            >
              Bot installed
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 justify-items-center perspective-[1000px] w-full max-w-[1200px] mx-auto"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15, delayChildren: 0.1 },
                },
              }}
            >
              {installedServers.map((guild) => (
                <ProfileCard
                  key={String(guild.id)}
                  name={guild.name}
                  email={String(guild.id)}
                  avatarSrc={guild.icon_url || undefined}
                  glowText={guild.plan && guild.plan.toLowerCase() !== "free" ? guild.plan : undefined}
                  isInstalled={true}
                  onManage={() => navigate(`/guilds/${guild.id}/settings`)}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* Non Installed Section */}
        {nonInstalledServers.length > 0 && (
          <div className="w-full max-w-6xl">
            <motion.h2
              className="mb-8 text-2xl font-semibold text-neutral-400 ml-4 md:ml-12"
              variants={subtitleVariants}
            >
              Non installed servers
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 justify-items-center perspective-[1000px] w-full max-w-[1200px] mx-auto"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15, delayChildren: 0.1 },
                },
              }}
            >
              {nonInstalledServers.map((guild) => (
                <ProfileCard
                  key={String(guild.id)}
                  name={guild.name}
                  email={String(guild.id)}
                  avatarSrc={guild.icon_url || undefined}
                  onAddBot={() => onAddBot?.(guild.id)}
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

/* ---------- Tilt server card ---------- */

function TiltCard({ guild, onAddBot }: { guild: Guild; onAddBot?: (id: string | number) => void }) {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (guild.has_bot) {
      navigate(`/guilds/${guild.id}/settings`);
    } else if (onAddBot) {
      onAddBot(guild.id);
    }
  };

  return (
    <motion.div variants={cardVariants} className="flex flex-col items-center gap-4">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative h-40 w-40 sm:h-52 sm:w-52 ${guild.has_bot ? "cursor-pointer" : "cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          }`}
      >
        {/* Image layer */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className={`absolute inset-0 overflow-hidden rounded-4xl bg-neutral-900 shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] flex items-center justify-center ${!guild.has_bot ? "grayscale-[0.5]" : ""
            }`}
        >
          {guild.icon_url ? (
            <img
              src={guild.icon_url}
              alt={guild.name}
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 transition-transform duration-500 group-hover:scale-110">
              <span className="text-5xl sm:text-7xl font-bold text-zinc-400 group-hover:text-zinc-200 select-none">
                {guild.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Border glow */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className={`absolute inset-0 rounded-4xl ring-1 ring-inset transition-colors duration-300 ${guild.has_bot
              ? "ring-white/10 group-hover:ring-white/30"
              : "ring-white/5 group-hover:ring-white/20"
            }`}
        />
      </motion.div>

      {/* Name and Plan - Now placed underneath the 3D card */}
      <div className="text-center w-40 sm:w-52 mt-1">
        <span className="block truncate text-[16px] font-medium text-neutral-200">
          {guild.name}
        </span>
        {guild.plan && guild.plan !== "free" && (
          <span className="block text-[11px] font-bold uppercase tracking-widest text-amber-400 mt-1">
            {guild.plan}
          </span>
        )}
      </div>
    </motion.div>
  );
}

