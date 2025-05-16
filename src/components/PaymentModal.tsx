
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";
import { Plan } from "@/contexts/PlanContext";
import { Spinner } from "@/components/ui/spinner";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onPayment: (paymentMethod: 'card' | 'crypto') => Promise<void>;
  isLoading: boolean;
};

const PaymentModal = ({ isOpen, onClose, plan, onPayment, isLoading }: PaymentModalProps) => {
  const [tab, setTab] = useState<'card' | 'crypto'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [walletAddress, setWalletAddress] = useState('');

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await onPayment('card');
  };

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await onPayment('crypto');
  };

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
        
        <Tabs defaultValue="card" value={tab} onValueChange={(value) => setTab(value as 'card' | 'crypto')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card" disabled={isLoading}>
              <div className="flex items-center space-x-2">
                <CreditCard size={16} />
                <span>Card Payment</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="crypto" disabled={isLoading}>
              <div className="flex items-center space-x-2">
                <Wallet size={16} />
                <span>Crypto</span>
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
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Your Wallet Address (for receipt)</Label>
                <Input 
                  id="walletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  disabled={isLoading}
                />
              </div>
              
              <div className="bg-silver-50 p-4 rounded-md">
                <p className="text-sm text-silver-700 mb-2">Send payment to:</p>
                <p className="font-mono text-xs break-all bg-white p-2 rounded border">
                  0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                </p>
                <p className="text-xs text-silver-600 mt-2">
                  Equivalent to ₦{plan.price.toLocaleString()} in USDT (TRC20)
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Spinner size="sm" className="mr-2" /> Verifying Payment...</> : "I've Sent the Payment"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
