
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Wifi, CreditCard, Calendar, Settings, Users, MessageSquare, Gift, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import silverUmbrellaLogo from "@/assets/silver-umbrella-logo.png";
import HederaWalletButton from "./HederaWalletButton";
import MobileNav from "./MobileNav";

type LayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

const Layout = ({ children, title, description }: LayoutProps) => {
  const { user, logout, checkIsAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Navigation items, different for user and admin
  const navItems = checkIsAdmin()
    ? [
        { name: "Dashboard", href: "/admin", icon: <Wifi size={20} /> },
        { name: "Plans", href: "/admin/plans", icon: <Calendar size={20} /> },
        { name: "Vouchers", href: "/admin/vouchers", icon: <CreditCard size={20} /> },
        { name: "Rewards", href: "/admin/rewards", icon: <Gift size={20} /> },
        { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: <Wifi size={20} /> },
        { name: "Plans", href: "/plans", icon: <Calendar size={20} /> },
        { name: "Vouchers", href: "/vouchers", icon: <CreditCard size={20} /> },
        { name: "Rewards", href: "/rewards", icon: <Gift size={20} /> },
        { name: "Hotspots", href: "/hotspots", icon: <Zap size={20} /> },
        { name: "Support", href: "/support", icon: <MessageSquare size={20} /> },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      {/* Mobile-optimized header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur-xl">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div 
            onClick={() => navigate(checkIsAdmin() ? '/admin' : '/dashboard')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={silverUmbrellaLogo} alt="Silver Umbrella" className="h-7 w-7 md:h-8 md:w-8" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm md:text-base leading-tight">Silver Umbrella</span>
              <span className="text-[10px] md:text-xs text-muted-foreground leading-tight hidden sm:block">dePIN Network</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <HederaWalletButton />
            <Button variant="ghost" size="sm" onClick={logout} className="hidden md:flex">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop sidebar navigation */}
      <div className="flex flex-1">
        {user && !isMobile && (
          <aside className="hidden md:flex w-64 border-r border-border/40 bg-card/50">
            <nav className="flex flex-col gap-1 p-4 w-full">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <main className="flex-1">
          <div className="container py-4 md:py-6 px-4">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-2 text-sm md:text-base">{description}</p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile bottom navigation */}
      {user && <MobileNav />}
    </div>
  );
};

export default Layout;
