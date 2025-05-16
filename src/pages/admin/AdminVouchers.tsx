
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePlans } from "@/contexts/PlanContext";
import { toast } from "@/components/ui/use-toast";

const AdminVouchers = () => {
  const { vouchers, plans } = usePlans();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter vouchers
  const filteredVouchers = vouchers.filter(voucher => {
    // Filter by status
    if (filterStatus === "active" && (!voucher.isActive || !voucher.expiresAt || new Date(voucher.expiresAt) <= new Date())) {
      return false;
    }
    if (filterStatus === "inactive" && voucher.isActive) {
      return false;
    }
    if (filterStatus === "expired" && (!voucher.isActive || !voucher.expiresAt || new Date(voucher.expiresAt) > new Date())) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !voucher.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getPlanNameById = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };
  
  const getPlanTypeById = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.type : "unknown";
  };
  
  const formatVoucherStatus = (voucher: typeof vouchers[0]) => {
    if (!voucher.isActive) return "Inactive";
    if (!voucher.expiresAt) return "Unknown";
    
    return new Date(voucher.expiresAt) > new Date() ? "Active" : "Expired";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-silver-100 text-silver-800";
    }
  };
  
  const handleGenerateVoucher = () => {
    // In a real app, this would open a modal to generate new vouchers
    toast({
      title: "Feature Not Implemented",
      description: "This would open a modal to generate new vouchers.",
    });
  };
  
  const handleDeleteVoucher = (voucherId: string) => {
    // In a real app, this would delete the voucher from Supabase
    toast({
      title: "Feature Not Implemented",
      description: "This would delete the voucher from the database.",
    });
  };

  return (
    <Layout
      title="Manage Vouchers"
      description="Generate and track service vouchers"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search vouchers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vouchers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerateVoucher}>Generate Vouchers</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Code</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Activated</th>
                  <th className="text-left py-3 px-4">Expires</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map(voucher => {
                  const status = formatVoucherStatus(voucher);
                  const statusColor = getStatusColor(status);
                  
                  return (
                    <tr key={voucher.id} className="border-b hover:bg-silver-50">
                      <td className="py-4 px-4 font-mono">{voucher.code}</td>
                      <td className="py-4 px-4">{getPlanNameById(voucher.planId)}</td>
                      <td className="py-4 px-4 capitalize">{getPlanTypeById(voucher.planId)}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {voucher.activatedAt 
                          ? new Date(voucher.activatedAt).toLocaleString()
                          : "Not activated"
                        }
                      </td>
                      <td className="py-4 px-4">
                        {voucher.expiresAt 
                          ? new Date(voucher.expiresAt).toLocaleString()
                          : "N/A"
                        }
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500"
                          onClick={() => handleDeleteVoucher(voucher.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredVouchers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-silver-500">
                      No vouchers found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminVouchers;
