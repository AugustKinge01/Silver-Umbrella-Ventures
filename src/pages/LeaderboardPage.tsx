import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Crown, Flame, Star, TrendingUp, Zap, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  lifetime_xp: number;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}

interface UserXP {
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  lifetime_xp: number;
}

const rankIcons = [
  <Crown className="w-6 h-6 text-amber-400" />,
  <Medal className="w-6 h-6 text-slate-400" />,
  <Medal className="w-6 h-6 text-amber-700" />
];

const levelTitles: Record<number, string> = {
  1: "Newcomer",
  2: "Beginner",
  3: "Regular",
  4: "Active",
  5: "Dedicated",
  10: "Veteran",
  15: "Expert",
  20: "Master",
  25: "Legend",
  30: "Champion",
  50: "Elite",
  100: "Immortal"
};

const getLevelTitle = (level: number): string => {
  const levels = Object.keys(levelTitles).map(Number).sort((a, b) => b - a);
  for (const l of levels) {
    if (level >= l) return levelTitles[l];
  }
  return "Newcomer";
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [user, timeframe]);

  const fetchLeaderboard = async () => {
    try {
      // Fetch top users
      const { data: xpData, error } = await supabase
        .from('user_xp')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch profiles for these users
      if (xpData && xpData.length > 0) {
        const userIds = xpData.map(x => x.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        const enrichedData = xpData.map(entry => ({
          ...entry,
          profile: profileMap.get(entry.user_id)
        }));

        setLeaderboard(enrichedData);

        // Find user's rank
        if (user) {
          const userIndex = enrichedData.findIndex(e => e.user_id === user.id);
          if (userIndex !== -1) {
            setUserRank(userIndex + 1);
            setUserXP({
              total_xp: enrichedData[userIndex].total_xp,
              current_level: enrichedData[userIndex].current_level,
              xp_to_next_level: (enrichedData[userIndex].current_level * 100) - enrichedData[userIndex].total_xp % 100,
              lifetime_xp: enrichedData[userIndex].lifetime_xp
            });
          } else {
            // User not in top 50, fetch their data separately
            const { data: userData } = await supabase
              .from('user_xp')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (userData) {
              setUserXP({
                total_xp: userData.total_xp,
                current_level: userData.current_level,
                xp_to_next_level: userData.xp_to_next_level,
                lifetime_xp: userData.lifetime_xp
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (entry: LeaderboardEntry): string => {
    if (entry.profile?.full_name) {
      return entry.profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (entry.profile?.email) {
      return entry.profile.email[0].toUpperCase();
    }
    return '?';
  };

  const getDisplayName = (entry: LeaderboardEntry): string => {
    if (entry.profile?.full_name) return entry.profile.full_name;
    if (entry.profile?.email) return entry.profile.email.split('@')[0];
    return `Player ${entry.user_id.slice(0, 6)}`;
  };

  return (
    <Layout title="Leaderboard" description="Top players in the ecosystem">
      {/* User Stats Card */}
      {user && userXP && (
        <Card className="mb-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-primary">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.email?.[0].toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-sm font-bold">
                  Lv.{userXP.current_level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                  <h3 className="text-xl font-bold">{user.email?.split('@')[0]}</h3>
                  <Badge variant="secondary">{getLevelTitle(userXP.current_level)}</Badge>
                </div>
                
                <div className="flex items-center gap-4 justify-center md:justify-start text-sm text-muted-foreground mb-3">
                  {userRank && (
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      Rank #{userRank}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {userXP.lifetime_xp.toLocaleString()} lifetime XP
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Level {userXP.current_level}</span>
                    <span>Level {userXP.current_level + 1}</span>
                  </div>
                  <Progress value={((100 - userXP.xp_to_next_level) / 100) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center">
                    {userXP.xp_to_next_level} XP to next level
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-card/50 rounded-lg p-3">
                  <Zap className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">{userXP.total_xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
                <div className="bg-card/50 rounded-lg p-3">
                  <Target className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <p className="text-2xl font-bold">{userXP.current_level}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top Players
            </CardTitle>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Players Yet</h3>
              <p className="text-muted-foreground">Be the first to earn XP!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[1, 0, 2].map((idx) => {
                    const entry = leaderboard[idx];
                    if (!entry) return null;
                    const isFirst = idx === 0;
                    return (
                      <div 
                        key={entry.id}
                        className={`text-center ${isFirst ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
                      >
                        <div className={`relative inline-block ${isFirst ? 'mb-4' : 'mt-8'}`}>
                          <Avatar className={`${isFirst ? 'w-20 h-20' : 'w-16 h-16'} border-4 ${
                            idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-slate-400' : 'border-amber-700'
                          }`}>
                            <AvatarFallback className={`${isFirst ? 'text-xl' : 'text-lg'} bg-muted`}>
                              {getInitials(entry)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2">
                            {rankIcons[idx]}
                          </div>
                        </div>
                        <p className="font-semibold truncate">{getDisplayName(entry)}</p>
                        <p className="text-sm text-primary font-bold">{entry.total_xp.toLocaleString()} XP</p>
                        <Badge variant="outline" className="mt-1">Lv.{entry.current_level}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rest of leaderboard */}
              <div className="space-y-2">
                {leaderboard.slice(3).map((entry, idx) => (
                  <div 
                    key={entry.id}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      entry.user_id === user?.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                    }`}
                  >
                    <div className="w-8 text-center font-bold text-muted-foreground">
                      #{idx + 4}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-muted">{getInitials(entry)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{getDisplayName(entry)}</p>
                      <p className="text-xs text-muted-foreground">{getLevelTitle(entry.current_level)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{entry.total_xp.toLocaleString()} XP</p>
                      <Badge variant="outline" className="text-xs">Lv.{entry.current_level}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default LeaderboardPage;
