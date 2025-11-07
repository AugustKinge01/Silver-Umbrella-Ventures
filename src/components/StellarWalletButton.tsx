import { Button } from "@/components/ui/button";
import { useStellar } from "@/contexts/StellarContext";
import { Wallet, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StellarWalletButton = () => {
  const { wallet, isConnecting, connectWallet, disconnectWallet, refreshBalance } = useStellar();

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
            <span className="hidden sm:inline">Connect Wallet</span>
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
            {wallet.publicKey.substring(0, 4)}...{wallet.publicKey.substring(wallet.publicKey.length - 4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Stellar Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2 space-y-2">
          <div className="text-xs text-muted-foreground">Public Key</div>
          <div className="font-mono text-xs break-all bg-muted p-2 rounded">
            {wallet.publicKey}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">XLM Balance</span>
            <span className="font-semibold">{parseFloat(wallet.balance).toFixed(4)} XLM</span>
          </div>

          {wallet.tokenBalances && Object.keys(wallet.tokenBalances).length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground mb-1">Token Balances</div>
              {Object.entries(wallet.tokenBalances).map(([token, balance]) => {
                const [code] = token.split(':');
                return (
                  <div key={token} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{code}</span>
                    <span className="font-medium">{parseFloat(balance).toFixed(2)}</span>
                  </div>
                );
              })}
            </>
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

export default StellarWalletButton;
