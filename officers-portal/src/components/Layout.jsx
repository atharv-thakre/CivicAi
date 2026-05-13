import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Target, 
  BrainCircuit, 
  Map as MapIcon, 
  History, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  AlertTriangle,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import NotificationReminder from './NotificationReminder';

const SidebarItem = ({ to, icon: Icon, label, badge, collapsed, children }) => {
  const location = useLocation();
  const isChildActive = children?.some(child => location.pathname === child.to);
  const [expanded, setExpanded] = useState(isChildActive);
  
  useEffect(() => {
    if (isChildActive) {
      setExpanded(true);
    }
  }, [isChildActive]);

  return (
    <div className="w-full">
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-6 py-3 transition-all duration-200 group relative text-sm font-medium",
          isActive || (isChildActive && !expanded)
            ? "text-civic-cyan border-l-[3px] border-civic-cyan active-nav-gradient" 
            : "text-text-secondary hover:bg-secondary hover:text-foreground border-l-[3px] border-transparent"
        )}
        onClick={(e) => {
          if (children) {
            setExpanded(!expanded);
          }
        }}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-1")} />
        {!collapsed && (
          <span className="font-medium whitespace-nowrap flex-grow">{label}</span>
        )}
        {!collapsed && badge !== undefined && (
          <Badge className="bg-civic-red hover:bg-civic-red text-white py-0 h-5 min-w-[20px] flex justify-center">{badge}</Badge>
        )}
        {collapsed && badge !== undefined && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-civic-red rounded-full" />
        )}
      </NavLink>
      
      {!collapsed && children && expanded && (
        <div className="ml-9 mt-1 space-y-1">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-all duration-200",
                isActive ? "text-civic-cyan" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{child.label}</span>
              {child.badge && <span className="text-[10px] bg-secondary px-1.5 rounded-full">{child.badge}</span>}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background overflow-hidden transition-colors duration-500">
      <NotificationReminder />
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        className="fixed left-0 top-0 h-full ios-glass border-r flex flex-col z-50 overflow-hidden shadow-sm"
      >
        <div className="p-4 flex items-center justify-between h-16 shrink-0 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div 
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 font-bold text-xl text-foreground"
              >
                <div className="w-8 h-8 bg-civic-cyan rounded flex items-center justify-center text-background text-sm font-black">
                  C
                </div>
                <div className="tracking-tight leading-none">
                  <span className="text-civic-cyan">CIVIC</span> AI
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="logo-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex justify-center"
              >
                <div className="w-8 h-8 bg-civic-cyan rounded flex items-center justify-center text-background text-sm font-black">
                  C
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ScrollArea className="flex-grow py-4 px-3">
          <nav className="space-y-1">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
            <SidebarItem 
              to="/complaints" 
              icon={ClipboardList} 
              label="Recent Complaints" 
              badge={5} 
              collapsed={collapsed}
              children={[
                { to: '/complaints/new', label: 'New Complaints' },
                { to: '/complaints/progress', label: 'In Progress' },
                { to: '/complaints/overdue', label: 'Overdue', badge: 2 },
              ]}
            />
            <SidebarItem 
              to="/plans" 
              icon={Target} 
              label="Action Plans" 
              collapsed={collapsed}
              children={[
                { to: '/plans/active', label: 'Active Plans' },
                { to: '/plans/completed', label: 'Completed' },
                { to: '/plans/templates', label: 'Templates' },
              ]}
            />
            <SidebarItem 
              to="/dss" 
              icon={BrainCircuit} 
              label="DSS Engine" 
              collapsed={collapsed} 
            />
            <SidebarItem to="/map" icon={MapIcon} label="Map View" collapsed={collapsed} />
            <SidebarItem to="/audit" icon={History} label="Audit Trail" collapsed={collapsed} />
            <SidebarItem to="/alerts" icon={Bell} label="Alerts" badge={3} collapsed={collapsed} />
            <div className="pt-4 mt-4 border-t border-border/50">
              <SidebarItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
              <button 
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-civic-red/10 hover:text-civic-red transition-all mt-1"
              >
                <LogOut className="w-5 h-5" />
                {!collapsed && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </nav>
        </ScrollArea>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 border-t hover:bg-secondary/50 flex justify-center transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-grow flex flex-col min-h-screen transition-all duration-300",
        collapsed ? "pl-[72px]" : "pl-[240px]"
      )}>
        {/* Top Bar */}
        <header className="h-16 ios-glass border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span className="text-foreground uppercase tracking-widest opacity-80">Officer Portal</span>
              <div className="w-[1px] h-6 bg-border mx-2" />
              <span className="text-text-muted uppercase tracking-[0.15em] text-[10px]">Production</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full w-9 h-9"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-text-secondary" /> : <Sun className="w-5 h-5 text-text-secondary" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-right flex flex-col">
                <span className="text-sm font-semibold">Officer Sharma</span>
                <span className="text-[10px] text-text-muted">ID: OFF-1129</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  nativeButton={false}
                  render={
                    <div className="w-9 h-9 rounded-full bg-border border border-border cursor-pointer overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                    </div>
                  }
                />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/login')} className="text-civic-red hover:text-civic-red hover:bg-civic-red/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <Button variant="ghost" size="icon" className="relative h-8 w-8" onClick={() => navigate('/alerts')}>
                <Bell className="w-5 h-5 text-text-muted" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-civic-red rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/settings')}>
                 <Settings className="w-5 h-5 text-text-muted" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <ScrollArea className="flex-grow">
          <main className="p-6 pb-20">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};
