import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Copy, Check, Phone, ExternalLink, Hash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useOneChain } from "@/contexts/OneChainContext";
import { useOneChainTransaction } from "@/hooks/useOneChainTransaction";
import { useToast } from "@/hooks/use-toast";
import { generateSecureVoucherCode, formatVoucherCode } from "@/lib/voucherGenerator";

export type BookingType = 'gaming' | 'coworking' | 'tournament';

interface BookingDetails {
  type: BookingType;
  name: string;
  description?: string;
  amount: number;
  xpEarned?: number;
  duration?: string;
  mealsIncluded?: number;
}

interface TransactionInfo {
  hash: string;
  explorerUrl: string;
  isDemo: boolean;
}

type BookingPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
  onPaymentComplete: (paymentMethod: 'card' | 'crypto', voucherCode: string, phone: string, txHash?: string) => Promise<void>;
};

const BookingPaymentModal = ({ isOpen, onClose, booking, onPaymentComplete }: BookingPaymentModalProps) => {
  const [tab, setTab] = useState<'card' | 'crypto'>('crypto');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState<string | null>(null);
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  
  const { wallet, connectWallet, isDemo } = useOneChain();
  const { executeTransaction, getTransactionUrl } = useOneChainTransaction();
  const { toast } = useToast();

  const validatePhone = (value: string) => {
    // Basic phone validation - at least 10 digits
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (at least 10 digits).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const voucherCode = generateSecureVoucherCode(phone);
      await onPaymentComplete('card', voucherCode, phone);
      setGeneratedVoucher(voucherCode);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!wallet) {
      await connectWallet();
      return;
    }

    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (at least 10 digits).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Execute real blockchain transaction
      const oneAmount = (booking!.amount / 1000).toFixed(4);
      const txResult = await executeTransaction(
        wallet.address,
        oneAmount,
        `${booking!.type}: ${booking!.name}`,
        isDemo
      );

      if (!txResult.success) {
        throw new Error(txResult.error || 'Transaction failed');
      }

      const voucherCode = generateSecureVoucherCode(phone);
      
      // Store transaction info for display
      if (txResult.digest) {
        setTransactionInfo({
          hash: txResult.digest,
          explorerUrl: getTransactionUrl(txResult.digest),
          isDemo,
        });
      }

      await onPaymentComplete('crypto', voucherCode, phone, txResult.digest || undefined);
      setGeneratedVoucher(voucherCode);
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedVoucher) return;
    
    try {
      await navigator.clipboard.writeText(generatedVoucher);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Voucher code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the code.",
        variant: "destructive"
      });
    }
  };

  const copyHashToClipboard = async () => {
    if (!transactionInfo?.hash) return;
    
    try {
      await navigator.clipboard.writeText(transactionInfo.hash);
      setHashCopied(true);
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard.",
      });
      setTimeout(() => setHashCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the hash.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setGeneratedVoucher(null);
    setTransactionInfo(null);
    setCopied(false);
    setHashCopied(false);
    setPhone('');
    setCardDetails({ cardNumber: '', expiryDate: '', cvv: '', name: '' });
    onClose();
  };

  const oneEquivalent = booking ? (booking.amount / 1000).toFixed(4) : '0';

  if (!booking) return null;

  // Show voucher success screen
  if (generatedVoucher) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Payment Successful! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Your {booking.type} session has been booked.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Session Voucher Code</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-mono font-bold tracking-wider bg-background px-4 py-2 rounded border">
                  {formatVoucherCode(generatedVoucher)}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 break-all">
                This code is bound to your phone: {phone}
              </p>
            </div>

            {/* Transaction Hash Section */}
            {transactionInfo && (
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Transaction Hash
                  </span>
                  {transactionInfo.isDemo && (
                    <Badge variant="secondary" className="text-xs">Demo</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-background p-2 rounded border flex-1 break-all">
                    {transactionInfo.hash}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyHashToClipboard}
                    className="shrink-0"
                  >
                    {hashCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs"
                  onClick={() => window.open(transactionInfo.explorerUrl, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Explorer {transactionInfo.isDemo && "(Simulated)"}
                </Button>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Session</span>
                <span className="font-medium">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid</span>
                <span className="font-medium">₦{booking.amount.toLocaleString()}</span>
              </div>
              {transactionInfo && (
                <div className="flex justify-between">
                  <span>Paid in ONE</span>
                  <span className="font-medium">{oneEquivalent} ONE</span>
                </div>
              )}
              {booking.xpEarned && (
                <div className="flex justify-between text-primary">
                  <span>XP Earned</span>
                  <span className="font-bold">+{booking.xpEarned} XP</span>
                </div>
              )}
              {booking.duration && (
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium">{booking.duration}</span>
                </div>
              )}
              {booking.mealsIncluded && booking.mealsIncluded > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Meals Included</span>
                  <span className="font-medium">{booking.mealsIncluded}</span>
                </div>
              )}
            </div>

            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            {booking.name} - ₦{booking.amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        {/* Phone input - required for voucher binding */}
        <div className="space-y-2 pb-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number (required for voucher)
          </Label>
          <Input 
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 123 4567"
            disabled={isLoading}
            required
          />
          <p className="text-xs text-muted-foreground">
            Your voucher will be securely bound to this phone number.
          </p>
        </div>

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

              {booking.xpEarned && (
                <div className="bg-primary/10 p-3 rounded-md text-center">
                  <p className="text-sm text-primary font-medium">
                    You'll earn +{booking.xpEarned} XP with this booking!
                  </p>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading || !phone}>
                {isLoading ? <><Spinner size="sm" className="mr-2" /> Processing...</> : `Pay ₦${booking.amount.toLocaleString()}`}
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
                    {isDemo && (
                      <p className="text-xs text-amber-600 mt-2">Demo Mode Active</p>
                    )}
                  </div>
                  
                  <div className="bg-secondary/10 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Payment Amount:</p>
                    <p className="font-bold text-lg">{oneEquivalent} ONE</p>
                    <p className="text-xs text-muted-foreground">
                      Equivalent to ₦{booking.amount.toLocaleString()}
                    </p>
                  </div>

                  {booking.xpEarned && (
                    <div className="bg-primary/10 p-3 rounded-md text-center">
                      <p className="text-sm text-primary font-medium">
                        You'll earn +{booking.xpEarned} XP with this booking!
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading || (!wallet && false) || !phone}>
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

export default BookingPaymentModal;
