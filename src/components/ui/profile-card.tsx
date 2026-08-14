import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Clock, Plus, Copy, Zap, Settings } from "lucide-react";
import MotionButton from "./motion-button";

interface ProfileCardProps {
  name?: string;
  email?: string;
  avatarSrc?: string;
  glowText?: string;
  className?: string;
  isInstalled?: boolean;
  onAddBot?: () => void;
  onManage?: () => void;
}

export default function ProfileCard({
  name = "Berat Berkay",
  email = "beratberkaygokdemir@gmail.com",
  avatarSrc = "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yc2pLdFl5STR0MkZMcUNKaVNMQVJXRmNBSXIifQ",
  glowText,
  className,
  isInstalled,
  onAddBot,
  onManage,
}: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  // Derive a local clock text once per minute
  const timeText = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const hour12 = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour12}:${m}${ampm}`;
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      className={cn("relative w-full max-w-xl", className)}
    >
      {glowText && (
        <>
          <div className="pointer-events-none absolute inset-x-0 -bottom-10 top-[72%] rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-md z-0" />

          <div className="absolute inset-x-0 -bottom-10 mx-auto w-full z-0">
            <div className="flex items-center justify-center gap-2 bg-transparent py-3 text-center text-sm font-medium text-white/80">
              <Zap className="h-4 w-4" /> {glowText}
            </div>
          </div>
        </>
      )}

      <div className={cn("relative z-10 mx-auto w-full overflow-visible rounded-[28px] border border-white/10 backdrop-blur-md text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]", "bg-[#18181B]")}>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 bg-white/10 flex items-center justify-center text-xl font-bold">
              {avatarSrc && !imageError && !avatarSrc.includes("ui-avatars.com") ? (
                <img
                  src={avatarSrc}
                  alt={`${name} avatar`}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span>{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {name}
              </h3>
            </div>
          </div>

          <div className="mt-6 flex w-full">
            {isInstalled ? (
              <MotionButton label="Manage" onClick={onManage} />
            ) : (
              <MotionButton label="Add Bot" onClick={onAddBot} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
