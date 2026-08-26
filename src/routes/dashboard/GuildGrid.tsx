import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaServer } from 'react-icons/fa';
import { ChevronRight, Server } from 'lucide-react';

interface GuildGridProps {
  guilds: Guild[];
  activeGuildId?: string;
  onAddBot: (guildId: string | number) => void;
}

const planStyles: Record<string, string> = {
  pro: 'text-blue-500 bg-blue-500/10',
  business: 'text-purple-400 bg-purple-500/10',
  free: 'text-slate-400 bg-white/5',
};

export const DashboardGuildGrid = ({
  guilds,
  activeGuildId,
  onAddBot,
}: GuildGridProps) => {
  const navigate = useNavigate();

  if (guilds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <FaServer className="text-xl text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-400 mb-1">No servers found</p>
        <p className="text-[13px] text-slate-600">Connect your Discord account to see your servers here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_100px_100px_140px] gap-4 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-3">
        <span>Server</span>
        <span className="text-center">Plan</span>
        <span className="text-center">Status</span>
        <span className="text-right">Action</span>
      </div>

      {/* Server rows */}
      {guilds.map((guild) => {
        const isActive = String(guild.id) === activeGuildId;
        const plan = planStyles[guild.plan || 'free'] || planStyles.free;

        const handleRowClick = () => {
          if (guild.has_bot) {
            navigate(`/guilds/${guild.id}/panels`);
          } else {
            onAddBot(guild.id);
          }
        };

        return (
          <div
            key={guild.id}
            onClick={handleRowClick}
            className={`group mb-3 grid cursor-pointer grid-cols-[1fr_100px_100px_140px] items-center gap-4 rounded-[16px] border border-white/[0.06] bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-white/[0.06] hover:shadow-[0_0_28px_rgba(245,166,35,0.12)] ${
              isActive ? 'border-amber-400/35 shadow-[0_0_20px_rgba(245,166,35,0.12)]' : ''
            }`}
          >
            {/* Server info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08]">
                {guild.icon_url ? (
                  <img
                    src={guild.icon_url}
                    alt={guild.name}
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                ) : (
                  <Server className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-white tracking-tight" title={guild.name}>
                  {guild.name}
                </p>
              </div>
            </div>

            {/* Plan badge */}
            <div className="flex justify-center">
              {guild.plan && (
                <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize ${plan}`}>
                  {guild.plan}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="flex justify-center">
              {guild.has_bot ? (
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#10b981]">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
                  </span>
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Offline
                </span>
              )}
            </div>

            {/* Action */}
            <div className="flex justify-end">
              {guild.has_bot ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/guilds/${guild.id}/panels`);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/10 px-4 py-2 text-[13px] font-semibold text-slate-200 transition-all duration-300 hover:border-amber-400/30 hover:bg-white/10 hover:text-white group/btn"
                >
                  Manage
                  <ChevronRight className="w-[14px] h-[14px] text-slate-400 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:text-white" strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-[13px] font-semibold text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddBot(guild.id);
                  }}
                >
                  <FaPlus className="text-[10px]" />
                  Add Bot
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
