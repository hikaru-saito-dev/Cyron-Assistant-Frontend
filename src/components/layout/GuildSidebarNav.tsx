import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaRobot,
  FaPalette,
  FaChartLine,
  FaServer,
  FaLayerGroup,
  FaBrain,
  FaTicketAlt,
  FaCog,
  FaChevronLeft
} from 'react-icons/fa';

type Tab = {
  id: string;
  label: string;
  to: (id: string) => string;
  icon: React.ReactNode;
};

type Section = {
  id: string;
  label: string;
  tabs: Tab[];
};

const sections: Section[] = [
  {
    id: 'management',
    label: 'Management',
    tabs: [
      {
        id: 'panels',
        label: 'Panels',
        to: (id: string) => `/guilds/${id}/panels`,
        icon: <FaLayerGroup className="w-[16px] h-[16px]" />,
      },
      {
        id: 'contexts',
        label: 'AI Contexts',
        to: (id: string) => `/guilds/${id}/contexts`,
        icon: <FaBrain className="w-[16px] h-[16px]" />,
      },
      {
        id: 'knowledge',
        label: 'Knowledge',
        to: (id: string) => `/guilds/${id}/knowledge`,
        icon: <FaBook className="w-[16px] h-[16px]" />,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    tabs: [
      {
        id: 'ai-settings',
        label: 'AI Settings',
        to: (id: string) => `/guilds/${id}/ai-settings`,
        icon: <FaRobot className="w-[16px] h-[16px]" />,
      },
      {
        id: 'embed-customization',
        label: 'Embed Customization',
        to: (id: string) => `/guilds/${id}/embed-customization`,
        icon: <FaPalette className="w-[16px] h-[16px]" />,
      },
      {
        id: 'close-settings',
        label: 'Close Settings',
        to: (id: string) => `/guilds/${id}/close-settings`,
        icon: <FaCog className="w-[16px] h-[16px]" />,
      },
      {
        id: 'usage-analytics',
        label: 'Usage Analytics',
        to: (id: string) => `/guilds/${id}/usage-analytics`,
        icon: <FaChartLine className="w-[16px] h-[16px]" />,
      },
      {
        id: 'tickets',
        label: 'Ticket Management',
        to: (id: string) => `/guilds/${id}/tickets`,
        icon: <FaTicketAlt className="w-[16px] h-[16px]" />,
      },
    ],
  },
];

type GuildSidebarNavProps = {
  guild?: Guild | null;
};

export const GuildSidebarNav = ({ guild }: GuildSidebarNavProps) => {
  const { guildId } = useParams<{ guildId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  if (!guildId) return null;

  const displayName = guild?.name?.trim() || 'Server';
  
  return (
    <div className="flex flex-col w-[260px] h-full bg-[#111111] border-r border-white/5 font-sans z-20 shrink-0">
      
      {/* Back to Dashboard & Logo */}
      <div className="flex flex-col shrink-0">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 h-12 text-[12px] font-medium text-slate-400 hover:text-white transition-colors group border-b border-white/5"
        >
          <FaChevronLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-0.5" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 shrink-0">
          {guild?.icon_url ? (
            <img src={guild.icon_url} alt={displayName} className="w-6 h-6 rounded-full shrink-0 object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] text-white font-medium">{displayName?.[0]?.toUpperCase() || '?'}</span>
            </div>
          )}
          <span className="text-[14px] font-medium text-white tracking-tight truncate">{displayName}</span>
        </div>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8">
        {sections.map(section => (
          <div key={section.id} className="flex flex-col gap-1">
            <div className="flex flex-col">
              {section.tabs.map(tab => {
                const target = tab.to(guildId);
                const isActive = location.pathname.startsWith(target);
                
                return (
                  <Link
                    key={tab.id}
                    to={target}
                    className={`group flex items-center gap-3 px-6 py-2.5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-[18px] h-[18px] transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {tab.icon}
                    </span>
                    <span className="text-[14px] font-medium">{tab.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
