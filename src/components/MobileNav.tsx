import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Wifi, Gift, TrendingUp, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/plans', icon: Zap, label: 'Plans' },
    { path: '/hotspots', icon: Wifi, label: 'Hotspots' },
    { path: '/rewards', icon: TrendingUp, label: 'Rewards' },
    { path: '/vouchers', icon: Gift, label: 'Vouchers' },
    { path: '/support', icon: LifeBuoy, label: 'Support' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-lg bg-opacity-95 safe-area-inset-bottom">
      <div className="grid grid-cols-6 gap-1 px-2 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
