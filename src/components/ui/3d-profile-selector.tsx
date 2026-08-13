import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { Server } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------- Types ---------- */

interface Guild {
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

/* ---------- Main component ---------- */

export default function ServerCards({ guilds, onAddBot }: ServerCardsProps) {
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

  if (!guilds || guilds.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-black pt-4 pb-12"
      onMouseMove={handleMouseMove}
    >
      <Spotlight mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        className="relative z-10 flex flex-col items-center px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="mb-12 text-center text-5xl sm:text-7xl font-black tracking-tighter text-white leading-none"
          variants={cardVariants}
        >
          Your Servers
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          style={{ perspective: "1000px" }}
          variants={sectionVariants}
        >
          {guilds.map((guild) => (
            <TiltCard key={String(guild.id)} guild={guild} onAddBot={onAddBot} />
          ))}
        </motion.div>
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
    600px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.06),
    transparent 80%
  )`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"
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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
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
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`group flex flex-col items-center gap-3 cursor-pointer ${!guild.has_bot ? "opacity-60 hover:opacity-100 transition-opacity duration-300" : ""}`}
      title={guild.has_bot ? `Manage ${guild.name}` : `Click to add bot to ${guild.name}`}
    >
      {/* Card */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-36 w-36 sm:h-44 sm:w-44"
      >
        {/* Emerald border for bot-active servers */}
        {guild.has_bot && (
          <div className="absolute inset-[-2px] rounded-[1.85rem] bg-emerald-500 opacity-80 blur-[1px] z-0" />
        )}

        {/* Card face */}
        <div
          style={{ transform: "translateZ(40px)" }}
          className={`absolute inset-0 overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-2xl z-10 transition-shadow duration-500 group-hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.15)] ${
            guild.has_bot ? "ring-2 ring-emerald-500/70" : "ring-1 ring-white/5"
          }`}
        >
          {guild.icon_url ? (
            <img
              src={guild.icon_url}
              alt={guild.name}
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
              <span className="text-4xl font-bold text-zinc-300 select-none">
                {guild.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Name — always below card, always aligned */}
      <div className="text-center w-36 sm:w-44">
        <span className="block truncate text-[13px] font-semibold text-white">
          {guild.name}
        </span>
        {guild.plan && guild.plan !== "free" && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {guild.plan}
          </span>
        )}
      </div>
    </motion.div>
  );
}

