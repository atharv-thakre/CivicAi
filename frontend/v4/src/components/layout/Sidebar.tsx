import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  UserCircle 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'complaints', icon: ClipboardList, label: 'Public Issues' },
    { id: 'trends', icon: TrendingUp, label: 'Sentiment Data' },
    { id: 'dss', icon: Zap, label: 'Policy Simulator' },
    { id: 'analytics', icon: BarChart3, label: 'Reports' },
    { id: 'comms', icon: MessageSquare, label: 'Communications' },
  ];

  return (
    <aside className="w-64 glass rounded-3xl p-6 flex flex-col gap-8 flex-shrink-0">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">C</div>
        <span className="text-xl font-bold tracking-tight text-white">CivicAI</span>
      </div>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-white/10 text-indigo-300 shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-indigo-400' : 'group-hover:text-white'}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">AI Status</p>
        <p className="text-xs text-slate-300 leading-tight mb-3">Predictive Analysis Engine Active</p>
        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
          Manage Insights
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
