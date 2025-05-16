
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Wifi, CreditCard, Calendar, Settings, Users, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type LayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

const Layout = ({ children, title, description }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Navigation items, different for user and admin
  const navItems = user?.isAdmin
    ? [
        { name: "Dashboard", href: "/admin", icon: <Wifi size={20} /> },
        { name: "Plans", href: "/admin/plans", icon: <Calendar size={20} /> },
        { name: "Vouchers", href: "/admin/vouchers", icon: <CreditCard size={20} /> },
        { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: <Wifi size={20} /> },
        { name: "Plans", href: "/plans", icon: <Calendar size={20} /> },
        { name: "Vouchers", href: "/vouchers", icon: <CreditCard size={20} /> },
        { name: "Hotspots", href: "/hotspots", icon: <Zap size={20} /> },
        { name: "Support", href: "/support", icon: <MessageSquare size={20} /> },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-silver-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-silver-300 text-white p-1 rounded-md">
              <Zap size={24} />
            </div>
            <span className="font-bold text-xl text-silver-900">Silver Umbrella</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-silver-600 hidden md:inline">
                {user.phone}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {user && (
          <aside className="w-full md:w-64 bg-white border-r border-gray-200">
            {isMobile ? (
              <nav className="flex overflow-x-auto p-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center justify-center p-3 mx-1 rounded-md min-w-[80px] ${
                        isActive
                          ? "bg-silver-100 text-silver-500"
                          : "text-silver-700 hover:bg-silver-50"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {item.icon}
                        <span className="text-xs mt-1">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <nav className="py-6 px-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 rounded-md ${
                        isActive
                          ? "bg-silver-100 text-silver-500 font-medium"
                          : "text-silver-700 hover:bg-silver-50"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </aside>
        )}

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-silver-900">{title}</h1>
            {description && (
              <p className="text-silver-600 mt-1">{description}</p>
            )}
          </div>
          {children}
        </main>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-silver-600 text-sm">
        © {new Date().getFullYear()} Silver Umbrella Ventures. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
