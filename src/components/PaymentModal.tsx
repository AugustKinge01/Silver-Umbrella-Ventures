import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";
import { Plan } from "@/contexts/PlanContext";
import { Spinner } from "@/components/ui/spinner";
import { useWeb3 } from "@/contexts/Web3Context";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onPayment: (paymentMethod: 'card' | 'crypto') => Promise<void>;
  isLoading: boolean;
};

const PaymentModal = ({ isOpen, onClose, plan, onPayment, isLoading }: PaymentModalProps) => {
  const [tab, setTab] = useState<'card' | 'crypto'>('crypto');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [walletAddress, setWalletAddress] = useState('');
  
  const { wallet, connectWallet } = useWeb3();

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await onPayment('card');
  };

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!wallet) {
      await connectWallet();
      return;
    }
    
    await onPayment('crypto');
  };

  const oneEquivalent = plan ? (plan.price / 1000).toFixed(4) : '0'; // Rough ONE conversion (₦1000 per ONE)

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You are purchasing the {plan.name} plan for ₦{plan.price.toLocaleString()}.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="crypto" value={tab} onValueChange={(value) => setTab(value as 'card' | 'crypto')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto" disabled={isLoading}>
              <div className="flex items-center space-x-2">
                <Wallet size={16} />
                <span>OneChain</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="card" disabled={isLoading}>
              <div className="flex items-center space-x-2">
                <CreditCard size={16} />
                <span>Card</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <form onSubmit={handleCardSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input 
                  id="name"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  placeholder="John Doe"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Spinner size="sm" className="mr-2" /> Processing...</> : `Pay ₦${plan.price.toLocaleString()}`}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="crypto">
            <form onSubmit={handleCryptoSubmit} className="space-y-4 py-2">
              {!wallet ? (
                <div className="bg-primary/10 p-4 rounded-md text-center">
                  <Wallet size={32} className="mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your OneChain wallet to proceed
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-primary/10 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Connected Wallet:</p>
                    <p className="font-mono text-xs break-all bg-background p-2 rounded border">
                      {wallet.address}
                    </p>
                  </div>
                  
                  <div className="bg-secondary/10 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Payment Amount:</p>
                    <p className="font-bold text-lg">{oneEquivalent} ONE</p>
                    <p className="text-xs text-muted-foreground">
                      Equivalent to ₦{plan.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <><Spinner size="sm" className="mr-2" /> Processing...</>
                ) : !wallet ? (
                  "Connect OneChain Wallet"
                ) : (
                  `Pay ${oneEquivalent} ONE`
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
