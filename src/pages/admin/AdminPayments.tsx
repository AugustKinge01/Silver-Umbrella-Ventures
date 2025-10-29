import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Search, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Payment = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  transaction_hash: string | null;
  description: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string;
  } | null;
};

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId);

      if (error) throw error;
      toast({ title: "Payment status updated" });
      fetchPayments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_hash?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Layout title="Payment Management" description="Monitor and manage all payments">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter(p => p.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter(p => p.status === 'failed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.profiles?.full_name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{payment.profiles?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.amount} {payment.currency}
                      </TableCell>
                      <TableCell className="uppercase">{payment.payment_method}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.transaction_hash ? (
                          <a 
                            href={`#`} 
                            className="flex items-center gap-1 text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {payment.transaction_hash.slice(0, 8)}...
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {payment.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePaymentStatus(payment.id, 'completed')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updatePaymentStatus(payment.id, 'failed')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminPayments;