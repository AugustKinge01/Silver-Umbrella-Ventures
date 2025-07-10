
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { usePlans } from '@/contexts/PlanContext';
import { Gift, Share2, Coins, History, Trophy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const RewardsPage = () => {
  const { 
    userPoints, 
    inviteCodes, 
    pointsRedemptions, 
    generateInviteCode, 
    useInviteCode, 
    redeemPoints,
    getPointsHistory 
  } = usePlans();
  
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const pointsHistory = getPointsHistory();

  const handleGenerateInvite = async () => {
    await generateInviteCode();
  };

  const handleUseInviteCode = async () => {
    if (!inviteCodeInput.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter an invite code.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await useInviteCode(inviteCodeInput.trim().toUpperCase());
    if (success) {
      setInviteCodeInput('');
    }
  };

  const handleRedeem = async (redemptionId: string) => {
    await redeemPoints(redemptionId);
  };

  return (
    <Layout title="Rewards & Points" description="Earn points by inviting friends and redeem for free data or power">
      <div className="space-y-6">
        {/* Points Balance */}
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Coins className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-amber-700">Your Points Balance</CardTitle>
            <div className="text-4xl font-bold text-amber-600">{userPoints}</div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="earn">Earn Points</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Earn Points Tab */}
          <TabsContent value="earn" className="space-y-6">
            {/* Generate Invite Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Generate Invite Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-silver-600 mb-4">
                  Share invite codes with friends and earn 50 points each time someone uses your code!
                </p>
                <Button onClick={handleGenerateInvite} className="w-full">
                  <Gift className="mr-2 h-4 w-4" />
                  Generate New Invite Code
                </Button>
              </CardContent>
            </Card>

            {/* Your Invite Codes */}
            {inviteCodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Invite Codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inviteCodes.slice(-3).map((invite) => (
                    <div key={invite.id} className="bg-silver-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-lg font-bold">{invite.code}</span>
                        <Badge variant={invite.isActive ? "default" : "secondary"}>
                          {invite.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-silver-600">
                        Used: {invite.uses}/{invite.maxUses} • Points per use: {invite.pointsPerUse}
                      </div>
                      {invite.expiresAt && (
                        <div className="text-xs text-silver-500">
                          Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Use Invite Code */}
            <Card>
              <CardHeader>
                <CardTitle>Use an Invite Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-silver-600 mb-4">
                  Have an invite code from a friend? Use it to help them earn points!
                </p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter invite code"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button onClick={handleUseInviteCode}>Use Code</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Points Tab */}
          <TabsContent value="redeem" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {pointsRedemptions.filter(r => r.isActive).map((redemption) => (
                <Card key={redemption.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{redemption.name}</CardTitle>
                      <Badge variant={redemption.type === 'internet' ? 'default' : 'secondary'}>
                        {redemption.type === 'internet' ? 'Internet' : 'Power'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-silver-600 mb-4">{redemption.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">
                        {redemption.pointsCost} points
                      </span>
                      <span className="text-sm text-silver-500">
                        {redemption.duration} hours
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleRedeem(redemption.id)}
                      disabled={userPoints < redemption.pointsCost}
                    >
                      {userPoints < redemption.pointsCost ? (
                        `Need ${redemption.pointsCost - userPoints} more points`
                      ) : (
                        'Redeem Now'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pointsHistory.length === 0 ? (
                  <p className="text-center text-silver-500 py-8">No transactions yet</p>
                ) : (
                  <div className="space-y-3">
                    {pointsHistory.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 bg-silver-50 rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-silver-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : '-'}{transaction.points}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RewardsPage;
