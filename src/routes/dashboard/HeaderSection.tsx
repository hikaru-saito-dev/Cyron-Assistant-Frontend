import { FaRobot, FaServer, FaTicketAlt } from 'react-icons/fa';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
  const adoptionRate = isLoading ? 0 : Math.round((stats.botInstalled / (stats.total || 1)) * 100);

  const cards = [
    {
      title: 'Total Servers',
      value: isLoading ? '—' : stats.total,
      trendValue: '+12.5%',
      trendText: 'Trending up this month',
      subText: 'Servers for the last 6 months',
      isUp: true,
    },
    {
      title: 'Bot Active',
      value: isLoading ? '—' : stats.botInstalled,
      trendValue: `${adoptionRate}%`,
      trendText: 'Strong adoption rate',
      subText: 'Coverage across all servers',
      isUp: true,
    },
    {
      title: 'Open Tickets',
      value: '—',
      trendValue: '-20%',
      trendText: 'Down 20% this period',
      subText: 'Support needs attention',
      isUp: false,
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-[#151515] border border-white/[0.05] rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-[13px] font-medium">{card.title}</span>
              <div className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-white/10 text-white">
                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trendValue}
              </div>
            </div>
            
            <span className="text-white text-2xl font-semibold tracking-tight mb-4">
              {card.value}
            </span>
            
            <div className="flex items-center justify-between text-[13px] text-white">
              <span className="font-medium">{card.trendText}</span>
              {card.isUp ? <ArrowUpRight className="w-3 h-3 text-white" /> : <ArrowDownRight className="w-3 h-3 text-white" />}
            </div>
            <span className="text-slate-500 text-[12px] mt-1">{card.subText}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
