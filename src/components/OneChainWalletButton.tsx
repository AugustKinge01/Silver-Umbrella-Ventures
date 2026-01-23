import { Button } from "@/components/ui/button";
import { useOneChain } from "@/contexts/OneChainContext";
import { Wallet, Loader2, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import MobileWalletConnect from "./MobileWalletConnect";

const OneChainWalletButton = () => {
  const { wallet, isConnecting, disconnectWallet, refreshBalance } = useOneChain();

  // Check if this is a demo wallet
  const isDemo = wallet && (wallet as any).isDemo;

  if (!wallet) {
    return (
      <MobileWalletConnect
        trigger={
          <Button 
            disabled={isConnecting}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </>
            )}
          </Button>
        }
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isDemo && <Zap className="h-4 w-4 text-warning" />}
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">
            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          OneChain Wallet
          {isDemo && (
            <Badge variant="secondary" className="text-xs">
              Demo Mode
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2 space-y-2">
          <div className="text-xs text-muted-foreground">Wallet Address</div>
          <div className="font-mono text-xs break-all bg-muted p-2 rounded">
            {wallet.address}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">ONE Balance</span>
            <span className="font-semibold">
              {parseFloat(wallet.balance).toFixed(4)} ONE
              {isDemo && <span className="text-xs text-muted-foreground ml-1">(demo)</span>}
            </span>
          </div>

          {isDemo && (
            <div className="bg-muted text-muted-foreground text-xs p-2 rounded border border-border">
              🎮 Demo mode: Transactions are simulated for hackathon judging
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={refreshBalance}>
          Refresh Balance
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OneChainWalletButton;
