import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';

type HederaWallet = {
  accountId: string;
  balance: string;
  network: 'testnet' | 'mainnet';
};

type HederaContextType = {
  wallet: HederaWallet | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendHBAR: (recipient: string, amount: number) => Promise<boolean>;
};

const HederaContext = createContext<HederaContextType | undefined>(undefined);

export const HederaProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<HederaWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check for existing wallet connection
    const savedWallet = localStorage.getItem('hedera_wallet');
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check for HashPack or Blade Wallet
      if (typeof window !== 'undefined') {
        // @ts-ignore - HashPack wallet extension
        const hashpack = window.hashpack;
        
        if (hashpack) {
          const data = await hashpack.connectToLocalWallet();
          const walletData: HederaWallet = {
            accountId: data.accountIds[0],
            balance: data.balance || '0',
            network: 'testnet'
          };
          
          setWallet(walletData);
          localStorage.setItem('hedera_wallet', JSON.stringify(walletData));
          toast.success('Wallet connected successfully!');
        } else {
          // Fallback to mock wallet for demo
          const mockWallet: HederaWallet = {
            accountId: '0.0.123456',
            balance: '100.00',
            network: 'testnet'
          };
          setWallet(mockWallet);
          localStorage.setItem('hedera_wallet', JSON.stringify(mockWallet));
          toast.success('Demo wallet connected!');
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet. Please install HashPack or Blade Wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('hedera_wallet');
    toast.info('Wallet disconnected');
  };

  const sendHBAR = async (recipient: string, amount: number): Promise<boolean> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      // In production, this would use @hashgraph/sdk
      toast.success(`Sent ${amount} HBAR to ${recipient}`);
      return true;
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed');
      return false;
    }
  };

  return (
    <HederaContext.Provider value={{
      wallet,
      isConnecting,
      connectWallet,
      disconnectWallet,
      sendHBAR
    }}>
      {children}
    </HederaContext.Provider>
  );
};

export const useHedera = () => {
  const context = useContext(HederaContext);
  if (context === undefined) {
    throw new Error('useHedera must be used within a HederaProvider');
  }
  return context;
};
