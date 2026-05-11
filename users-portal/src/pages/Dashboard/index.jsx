import WelcomeHero from './WelcomeHero';
import StatsGrid from './StatsGrid';
import RecentActivities from './RecentActivities';
import LiveData from './LiveData';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase invisible lg:visible h-0 lg:h-auto">Dashboard</h1>
          <div className="mb-2 lg:hidden">
             <h1 className="text-2xl font-bold uppercase">Dashboard</h1>
             <p className="text-[10px] uppercase font-bold text-vision-slate-400 tracking-widest mt-1">District 7 Overview</p>
          </div>
        </div>
      </div>

      <WelcomeHero />
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <RecentActivities />
        <LiveData />
      </div>
    </div>
  );
}
