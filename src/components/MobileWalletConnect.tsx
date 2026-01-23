import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOneChain } from "@/contexts/OneChainContext";
import { 
  Wallet, 
  QrCode, 
  Smartphone, 
  MonitorSmartphone,
  Copy,
  Check,
  Zap
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import QRCode from "react-qr-code";
import { toast } from "sonner";

interface MobileWalletConnectProps {
  trigger?: React.ReactNode;
}

const MobileWalletConnect = ({ trigger }: MobileWalletConnectProps) => {
  const { wallet, connectWallet, isConnecting } = useOneChain();
  const [manualAddress, setManualAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a unique session ID for QR code connection
  const sessionId = `onechain-${Date.now()}`;
  const connectUrl = `${window.location.origin}/wallet-connect?session=${sessionId}`;

  const handleManualConnect = () => {
    if (!manualAddress || manualAddress.length < 10) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    
    // Store the manual address in context (we'll update OneChainContext)
    const walletInfo = {
      address: manualAddress,
      balance: "100.0", // Demo balance
      network: "testnet" as const,
    };
    
    localStorage.setItem("onechain_wallet", JSON.stringify(walletInfo));
    window.location.reload(); // Refresh to pick up the new wallet
    toast.success("Wallet connected successfully!");
    setIsOpen(false);
  };

  const handleDemoMode = () => {
    // Create a demo wallet for hackathon judging
    const demoAddress = "0x" + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    
    const walletInfo = {
      address: demoAddress,
      balance: "1000.0", // Demo balance
      network: "testnet" as const,
      isDemo: true,
    };
    
    localStorage.setItem("onechain_wallet", JSON.stringify(walletInfo));
    window.location.reload();
    toast.success("Demo wallet activated! 🎮");
    setIsOpen(false);
  };

  const copyConnectUrl = () => {
    navigator.clipboard.writeText(connectUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (wallet) {
    return null; // Already connected
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connect OneWallet
          </DialogTitle>
          <DialogDescription>
            Choose your preferred connection method for OneChain
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qr" className="text-xs">
              <QrCode className="h-4 w-4 mr-1" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-xs">
              <Smartphone className="h-4 w-4 mr-1" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="demo" className="text-xs">
              <Zap className="h-4 w-4 mr-1" />
              Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="space-y-4 mt-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCode 
                  value={connectUrl} 
                  size={180}
                  level="H"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan with OneWallet on your desktop browser to connect
              </p>
              <div className="flex items-center gap-2 w-full">
                <Input 
                  value={connectUrl} 
                  readOnly 
                  className="text-xs"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyConnectUrl}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Desktop fallback */}
            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <MonitorSmartphone className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Desktop Extension"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Use this if you have OneWallet Chrome extension installed
              </p>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="0x..."
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter your OneChain wallet address to connect. This allows read-only 
                access for viewing balances and history.
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={handleManualConnect}
              disabled={!manualAddress}
            >
              Connect Wallet
            </Button>
          </TabsContent>

          <TabsContent value="demo" className="space-y-4 mt-4">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center space-y-3">
              <div className="text-4xl">🎮</div>
              <h3 className="font-semibold">Demo Mode</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for hackathon judging! Creates a simulated wallet with 
                1,000 ONE tokens to test all features.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Simulated transactions</li>
                <li>✓ Test voucher purchases</li>
                <li>✓ Full payment flow demo</li>
              </ul>
            </div>
            <Button 
              className="w-full gap-2 bg-gradient-to-r from-primary to-accent" 
              onClick={handleDemoMode}
            >
              <Zap className="h-4 w-4" />
              Activate Demo Mode
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              <span className="text-accent font-medium">Hackathon Mode:</span> No real 
              blockchain transactions will occur
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWalletConnect;
