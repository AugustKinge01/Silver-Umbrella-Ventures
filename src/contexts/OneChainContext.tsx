import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';

// OneWallet types (similar to window.ethereum but for OneChain)
interface OneWallet {
  connect: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  getAccounts: () => Promise<string[]>;
  signAndExecuteTransactionBlock: (params: any) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    oneWallet?: OneWallet;
  }
}

type WalletInfo = {
  address: string;
  balance: string;
  network: 'testnet' | 'mainnet';
  isDemo?: boolean;
};

type OneChainContextType = {
  wallet: WalletInfo | null;
  isConnecting: boolean;
  isDemo: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signAndExecuteTransaction: (transaction: any) => Promise<any>;
  refreshBalance: () => Promise<void>;
};

const OneChainContext = createContext<OneChainContextType | undefined>(undefined);

// OneChain Testnet configuration
const ONECHAIN_NETWORK = 'testnet';
const ONECHAIN_RPC_URL = 'https://testnet-rpc.onechain.one'; // Update with actual RPC

export const OneChainProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check for existing wallet connection
    const savedWallet = localStorage.getItem('onechain_wallet');
    if (savedWallet) {
      const parsedWallet = JSON.parse(savedWallet);
      setWallet(parsedWallet);
      // Auto-refresh balance
      refreshBalanceForWallet(parsedWallet.address);
    }

    // Listen for account changes
    if (window.oneWallet) {
      const handleAccountChange = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          refreshBalanceForWallet(accounts[0]);
        }
      };

      window.oneWallet.on('accountsChanged', handleAccountChange);

      return () => {
        window.oneWallet?.off('accountsChanged', handleAccountChange);
      };
    }
  }, []);

  const refreshBalanceForWallet = async (address: string) => {
    try {
      // TODO: Implement actual balance fetching using Sui SDK or OneChain RPC
      // For now, use mock balance
      const balance = '100.0'; // Mock balance in ONE tokens

      const updatedWallet: WalletInfo = {
        address,
        balance,
        network: 'testnet',
      };

      setWallet(updatedWallet);
      localStorage.setItem('onechain_wallet', JSON.stringify(updatedWallet));
    } catch (error: any) {
      console.error('Error refreshing balance:', error);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;
    await refreshBalanceForWallet(wallet.address);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if OneWallet is installed
      if (!window.oneWallet) {
        toast.error('Please install OneWallet extension');
        window.open('https://chromewebstore.google.com/detail/onewallet/gclmcgmpkgblaglfokkaclneihpnbkli', '_blank');
        setIsConnecting(false);
        return;
      }

      // Request connection
      const result = await window.oneWallet.connect();
      
      if (!result.address) {
        toast.error('Failed to get address from OneWallet');
        setIsConnecting(false);
        return;
      }

      // Load account and get balance
      await refreshBalanceForWallet(result.address);
      
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('onechain_wallet');
    toast.info('Wallet disconnected');
  };

  const signAndExecuteTransaction = async (transaction: any): Promise<any> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    if (!window.oneWallet) {
      toast.error('OneWallet not found');
      throw new Error('OneWallet not found');
    }

    try {
      const result = await window.oneWallet.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      return result;
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed: ' + error.message);
      throw error;
    }
  };

  return (
    <OneChainContext.Provider value={{ 
      wallet, 
      isConnecting,
      isDemo: wallet?.isDemo ?? false,
      connectWallet, 
      disconnectWallet,
      signAndExecuteTransaction,
      refreshBalance
    }}>
      {children}
    </OneChainContext.Provider>
  );
};

export const useOneChain = () => {
  const context = useContext(OneChainContext);
  if (context === undefined) {
    throw new Error('useOneChain must be used within a OneChainProvider');
  }
  return context;
};
