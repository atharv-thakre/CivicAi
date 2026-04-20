import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  ListTodo,
  Map as MapIcon,
  TrendingUp,
  Search,
  Bell,
  User,
  Shield,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export const Sidebar = ({ theme, toggleTheme }) => {
  const items = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: PlusCircle, label: "File Report", path: "/register" },
    { icon: ListTodo, label: "My Ledger", path: "/complaints" },
    { icon: MapIcon, label: "Geo View", path: "/map" },
    { icon: TrendingUp, label: "Metrics", path: "/trends" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] glass rounded-3xl fixed left-4 top-4 z-50 shadow-2xl shadow-blue-500/5">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-vision-accent rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">CivicAlert</span>
        </div>
      </div>
      <div className="mx-4 h-px bg-[var(--border)]"></div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-[13px] font-bold tracking-tight group",
                isActive
                  ? "bg-vision-accent text-white shadow-lg shadow-blue-500/25"
                  : "text-vision-slate-400 hover:bg-black/5 dark:hover:bg-white/5 dark:hover:text-white hover:text-slate-900",
              )
            }
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
              )}
            />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 space-y-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 glass rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-bold tracking-tight"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "LIGHT MODE" : "DARK MODE"}</span>
          </div>
        </button>
        <div className="glass rounded-2xl p-4 overflow-hidden relative border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-vision-slate-400 mb-1">
              Citizen
            </p>
            <p className="text-sm font-bold truncate">Marcus Holloway</p>
            <p className="text-[10px] text-vision-accent font-bold">
              Verified • District 7
            </p>
          </div>
          <User className="absolute -right-2 -bottom-2 w-12 h-12 opacity-5" />
        </div>
      </div>
    </aside>
  );
};

export const BottomNav = ({ theme, toggleTheme }) => {
  const items = [
    { icon: Home, label: "Home", path: "/" },
    { icon: PlusCircle, label: "File", path: "/register" },
    { icon: ListTodo, label: "Ledger", path: "/complaints", badge: 2 },
    { icon: MapIcon, label: "Geo", path: "/map" },
    { icon: TrendingUp, label: "Stats", path: "/trends" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 glass rounded-3xl px-2 py-1 z-50 shadow-2xl shadow-blue-500/10">
      <div className="flex justify-around items-center">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 min-w-[60px] transition-all relative",
                isActive
                  ? "text-vision-accent scale-110"
                  : "text-vision-slate-400",
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-tight leading-none mt-1">
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold border-2 border-[var(--glass)] shadow-sm">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-vision-slate-400"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-[9px] font-bold tracking-tight leading-none mt-1">
            Theme
          </span>
        </button>
      </div>
    </nav>
  );
};

export const Header = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="hidden lg:flex items-center justify-between h-20 bg-transparent px-8 sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
          <input
            type="text"
            placeholder="Search reports or areas..."
            className="w-full pl-11 pr-4 py-2.5 glass border-none rounded-2xl text-xs placeholder:text-vision-slate-400 focus:outline-none ring-1 ring-black/5 dark:ring-white/10 focus:ring-vision-accent/50 transition-all font-sans"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-8">
        <button
          onClick={toggleTheme}
          className="p-2.5 glass rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-vision-slate-400 hover:text-vision-accent"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2 hover:text-vision-accent cursor-pointer transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Sign In
          </span>
        </button>
        <button className="text-vision-slate-400 hover:text-vision-accent transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-vision-accent rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
