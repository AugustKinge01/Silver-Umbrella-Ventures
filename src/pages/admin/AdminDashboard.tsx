
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Wifi, Zap } from "lucide-react";

const AdminDashboard = () => {
  // This would be fetched from Supabase in a real app
  const stats = {
    totalUsers: 152,
    activeVouchers: 87,
    totalRevenue: 125000,
    activeHotspots: 3,
  };

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
            <Users size={16} className="text-silver-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-silver-500">+12 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <CreditCard size={16} className="text-silver-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVouchers}</div>
            <p className="text-xs text-silver-500">+5 in the last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-silver-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-silver-500">+₦18,000 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hotspots</CardTitle>
            <Wifi size={16} className="text-silver-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeHotspots}</div>
            <p className="text-xs text-silver-500">1 in maintenance mode</p>
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
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">James Smith</p>
                  <p className="text-sm text-silver-500">Power Basic (₦300)</p>
                </div>
                <div className="ml-auto font-medium">+₦300</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Mary Johnson</p>
                  <p className="text-sm text-silver-500">Browsing Pro (₦1,000)</p>
                </div>
                <div className="ml-auto font-medium">+₦1,000</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Robert Williams</p>
                  <p className="text-sm text-silver-500">Weekly Internet (₦3,000)</p>
                </div>
                <div className="ml-auto font-medium">+₦3,000</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Patricia Davis</p>
                  <p className="text-sm text-silver-500">Power Plus (₦800)</p>
                </div>
                <div className="ml-auto font-medium">+₦800</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Michael Brown</p>
                  <p className="text-sm text-silver-500">Browsing Basic (₦500)</p>
                </div>
                <div className="ml-auto font-medium">+₦500</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi size={18} />
                  <span className="font-medium">Ijero Community Center Internet</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap size={18} />
                  <span className="font-medium">Ijero Community Center Power</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi size={18} />
                  <span className="font-medium">EKSU Campus Library Internet</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi size={18} />
                  <span className="font-medium">Ado Market Hub Internet</span>
                </div>
                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">Maintenance</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap size={18} />
                  <span className="font-medium">Ado Market Hub Power</span>
                </div>
                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
