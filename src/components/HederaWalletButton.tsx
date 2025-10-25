import { useHedera } from '@/contexts/HederaContext';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { Spinner } from './ui/spinner';

const HederaWalletButton = () => {
  const { wallet, isConnecting, connectWallet, disconnectWallet } = useHedera();

  if (wallet) {
    return (
      <Button 
        variant="outline" 
        onClick={disconnectWallet}
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">
          {wallet.accountId.slice(0, 8)}...
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {wallet.balance} HBAR
        </span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="gap-2"
    >
      {isConnecting ? (
        <>
          <Spinner className="w-4 h-4" />
          <span className="hidden sm:inline">Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </>
      )}
    </Button>
  );
};

export default HederaWalletButton;
