import { Sidebar, BottomNav, Header } from "./Navigation";
import { useLocation } from "react-router-dom";
import { User } from "lucide-react";

export const Layout = ({ children, theme, toggleTheme }) => {
  const location = useLocation();

  // Titles for mobile header based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/register":
        return "File Complaint";
      case "/complaints":
        return "My Complaints";
      case "/map":
        return "Map View";
      case "/trends":
        return "Civic Trends";
      case "/login":
        return "Sign In";
      case "/signup":
        return "Create Account";
      default:
        return "VisionCivic";
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-4 transition-colors duration-500">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-6 glass border-none sticky top-0 z-40 rounded-b-3xl">
          <h1 className="text-lg font-bold tracking-tight">{getPageTitle()}</h1>
          <button className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center">
            <User size={18} />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
      <BottomNav theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};
