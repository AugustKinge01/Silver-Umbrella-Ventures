
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/components/Layout';
import { usePlans } from '@/contexts/PlanContext';
import { Users, Gift, TrendingUp, Award, Eye, Ban } from 'lucide-react';

const AdminRewards = () => {
  const { inviteCodes, pointsTransactions, pointsRedemptions } = usePlans();

  // Calculate stats
  const totalInviteCodes = inviteCodes.length;
  const activeInviteCodes = inviteCodes.filter(ic => ic.isActive).length;
  const totalInviteUses = inviteCodes.reduce((sum, ic) => sum + ic.uses, 0);
  const totalPointsEarned = pointsTransactions
    .filter(pt => pt.type === 'earned')
    .reduce((sum, pt) => sum + pt.points, 0);
  const totalPointsRedeemed = pointsTransactions
    .filter(pt => pt.type === 'redeemed')
    .reduce((sum, pt) => sum + pt.points, 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <Layout title="Admin - Rewards System" description="Manage invites, points, and redemptions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invite Codes</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInviteCodes}</div>
              <p className="text-xs text-muted-foreground">
                {activeInviteCodes} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invite Uses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInviteUses}</div>
              <p className="text-xs text-muted-foreground">
                New users acquired
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPointsEarned}</div>
              <p className="text-xs text-muted-foreground">
                Total distributed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPointsRedeemed}</div>
              <p className="text-xs text-muted-foreground">
                Free vouchers given
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="codes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="codes">Invite Codes</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
          </TabsList>

          {/* Invite Codes Tab */}
          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <CardTitle>All Invite Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Inviter</TableHead>
                        <TableHead>Uses</TableHead>
                        <TableHead>Points/Use</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inviteCodes.map((invite) => (
                        <TableRow key={invite.id}>
                          <TableCell className="font-mono font-bold">{invite.code}</TableCell>
                          <TableCell>{invite.inviterPhone}</TableCell>
                          <TableCell>
                            {invite.uses}/{invite.maxUses}
                          </TableCell>
                          <TableCell>{invite.pointsPerUse}</TableCell>
                          <TableCell>{new Date(invite.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : 'No expiry'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={invite.isActive ? "default" : "secondary"}>
                              {invite.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Ban className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Points Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pointsTransactions.slice(0, 20).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.userId}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'earned' ? "default" : "secondary"}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.points}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redemptions Tab */}
          <TabsContent value="redemptions">
            <Card>
              <CardHeader>
                <CardTitle>Available Redemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {pointsRedemptions.map((redemption) => (
                    <Card key={redemption.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{redemption.name}</CardTitle>
                          <Badge variant={redemption.type === 'internet' ? 'default' : 'secondary'}>
                            {redemption.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-silver-600 mb-2">{redemption.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Cost: <strong>{redemption.pointsCost} points</strong></span>
                          <span>Duration: <strong>{redemption.duration}h</strong></span>
                        </div>
                        <div className="mt-2">
                          <Badge variant={redemption.isActive ? "default" : "secondary"}>
                            {redemption.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminRewards;
