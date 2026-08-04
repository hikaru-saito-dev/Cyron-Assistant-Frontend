import { Link } from 'react-router-dom';
import { FaDiscord, FaPlus, FaRobot, FaServer, FaTicketAlt } from 'react-icons/fa';

interface HeaderSectionProps {
  selectedGuild: Guild | null;
  stats: { total: number; botInstalled: number };
  isLoading: boolean;
  onAddBot: (guildId: string | number) => void;
}

export const DashboardHeaderSection = ({
  selectedGuild,
  stats,
  isLoading,
  onAddBot,
}: HeaderSectionProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 bg-black/40 backdrop-blur-xl overflow-hidden rounded-xl border border-white/10 shadow-2xl">
        {[
          {
            title: 'Total Servers',
            subtitle: 'All your Discord guilds',
            value: isLoading ? '—' : stats.total,
            badge: {
              color: 'bg-indigo-500/20 text-indigo-300',
              icon: FaServer,
              iconColor: 'text-indigo-400',
              text: 'Servers',
            },
            subtext: (
              <span className="text-gray-400 font-normal">Across all networks</span>
            ),
          },
          {
            title: 'Bot Installed',
            subtitle: 'Guilds with active bot',
            value: isLoading ? '—' : stats.botInstalled,
            badge: {
              color: 'bg-emerald-500/20 text-emerald-300',
              icon: FaRobot,
              iconColor: 'text-emerald-400',
              text: 'Active',
            },
            subtext: (
              <span className="text-emerald-400 font-medium">
                {isLoading ? '—' : Math.round((stats.botInstalled / (stats.total || 1)) * 100)}% <span className="text-gray-400 font-normal">adoption rate</span>
              </span>
            ),
          },
          {
            title: 'Active Tickets',
            subtitle: 'Currently open',
            value: '-',
            badge: {
              color: 'bg-sky-500/20 text-sky-300',
              icon: FaTicketAlt,
              iconColor: 'text-sky-400',
              text: 'Tickets',
            },
            subtext: (
              <span className="text-gray-400 font-normal">Awaiting response</span>
            ),
          },
        ].map((card, i) => (
          <div
            key={i}
            className="flex flex-col h-full space-y-6 justify-between p-6 border-y md:border-x md:border-y-0 border-white/10 last:border-0 first:border-0"
          >
            {/* Title & Subtitle */}
            <div className="space-y-0.5">
              <div className="text-lg font-semibold text-white">{card.title}</div>
              <div className="text-sm text-gray-400">{card.subtitle}</div>
            </div>

            {/* Information */}
            <div className="flex-1 flex flex-col gap-1.5 justify-between grow">
              {/* Value & Delta */}
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-tight text-white">{card.value}</span>
                <span
                  className={`${card.badge.color} px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1`}
                >
                  <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                  {card.badge.text}
                </span>
              </div>
              {/* Subtext */}
              <div className="text-sm">{card.subtext}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


