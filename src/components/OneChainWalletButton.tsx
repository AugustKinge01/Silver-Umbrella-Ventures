import { Button } from "@/components/ui/button";
import { useOneChain } from "@/contexts/OneChainContext";
import { Wallet, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OneChainWalletButton = () => {
  const { wallet, isConnecting, connectWallet, disconnectWallet, refreshBalance } = useOneChain();

  if (!wallet) {
    return (
      <Button 
        onClick={connectWallet} 
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
            <span className="hidden sm:inline">Connect OneWallet</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">
            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>OneChain Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2 space-y-2">
          <div className="text-xs text-muted-foreground">Wallet Address</div>
          <div className="font-mono text-xs break-all bg-muted p-2 rounded">
            {wallet.address}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">ONE Balance</span>
            <span className="font-semibold">{parseFloat(wallet.balance).toFixed(4)} ONE</span>
          </div>
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
