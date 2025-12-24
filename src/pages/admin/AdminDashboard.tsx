import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Wifi, Zap, DollarSign, Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalUsers: number;
  activeVouchers: number;
  totalRevenue: number;
  activeHotspots: number;
  totalHotspots: number;
  activeSessions: number;
}

interface RecentPayment {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  profiles?: { full_name: string | null };
}

interface HotspotStatus {
  id: string;
  name: string;
  status: string;
  is_solar_powered: boolean;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [hotspotStatuses, setHotspotStatuses] = useState<HotspotStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch active vouchers count
        const { count: voucherCount } = await supabase
          .from('vouchers')
          .select('*', { count: 'exact', head: true })
          .eq('is_used', false);

        // Fetch total revenue
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed');
        
        const totalRevenue = paymentsData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        // Fetch hotspot counts
        const { data: hotspotsData } = await supabase
          .from('hotspots')
          .select('id, name, status, is_solar_powered');
        
        const activeHotspots = hotspotsData?.filter(h => h.status === 'active').length || 0;
        const totalHotspots = hotspotsData?.length || 0;

        // Fetch active gaming sessions
        const { count: sessionCount } = await supabase
          .from('gaming_sessions')
          .select('*', { count: 'exact', head: true })
          .is('end_time', null);

        setStats({
          totalUsers: userCount || 0,
          activeVouchers: voucherCount || 0,
          totalRevenue,
          activeHotspots,
          totalHotspots,
          activeSessions: sessionCount || 0,
        });

        setHotspotStatuses(hotspotsData || []);

        // Fetch recent payments with user info
        const { data: payments } = await supabase
          .from('payments')
          .select(`
            id,
            amount,
            description,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (payments) {
          // Fetch profiles for payments
          const userIds = payments.map(p => p.user_id);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);

          const paymentsWithProfiles = payments.map(p => ({
            ...p,
            profiles: profiles?.find(pr => pr.id === p.user_id),
          }));

          setRecentPayments(paymentsWithProfiles);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Admin Dashboard" description="Overview of Silver Umbrella operations">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Admin Dashboard"
      description="Overview of Silver Umbrella operations"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Vouchers</CardTitle>
            <CreditCard size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeVouchers || 0}</div>
            <p className="text-xs text-muted-foreground">Unused vouchers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hotspots</CardTitle>
            <Wifi size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeHotspots || 0} / {stats?.totalHotspots || 0}</div>
            <p className="text-xs text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {recentPayments.map(payment => (
                  <div key={payment.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {payment.profiles?.full_name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.description || 'Payment'}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+${Number(payment.amount).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hotspot Status</CardTitle>
          </CardHeader>
          <CardContent>
            {hotspotStatuses.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hotspots configured</p>
            ) : (
              <div className="space-y-4">
                {hotspotStatuses.map(hotspot => (
                  <div key={hotspot.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {hotspot.is_solar_powered ? <Zap size={18} /> : <Wifi size={18} />}
                      <span className="font-medium text-sm">{hotspot.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      hotspot.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : hotspot.status === 'maintenance'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {hotspot.status === 'active' ? 'Online' : hotspot.status === 'maintenance' ? 'Maintenance' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gaming Stats */}
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Gaming Hub</CardTitle>
            <Gamepad2 size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSessions || 0}</div>
            <p className="text-sm text-muted-foreground">Active gaming sessions right now</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;