import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Building2, Trophy, Gift, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MobileNav = () => {
  const location = useLocation();

  const mainItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/coworking', icon: Building2, label: 'Cowork' },
    { path: '/gaming', icon: Gamepad2, label: 'Gaming' },
    { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
  ];

  const moreItems = [
    { path: '/plans', label: 'Plans' },
    { path: '/vouchers', label: 'Vouchers' },
    { path: '/hotspots', label: 'Hotspots' },
    { path: '/support', label: 'Support' },
  ];

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-lg bg-opacity-95 safe-area-inset-bottom">
      <div className="grid grid-cols-6 gap-1 px-2 py-2">
        {mainItems.map(({ path, icon: Icon, label }) => {
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all",
                isMoreActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-2">
            {moreItems.map(({ path, label }) => (
              <DropdownMenuItem key={path} asChild>
                <Link to={path} className={cn(location.pathname === path && "bg-accent")}>
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default MobileNav;
