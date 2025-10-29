import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type HederaWallet = {
  accountId: string;
  balance: string;
  network: 'testnet' | 'mainnet';
  tokenBalances?: Record<string, string>;
};

type HederaContextType = {
  wallet: HederaWallet | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendHBAR: (recipient: string, amount: number) => Promise<boolean>;
  createToken: (name: string, symbol: string, supply: number) => Promise<string | null>;
  transferToken: (tokenId: string, toAccountId: string, amount: number) => Promise<boolean>;
  refreshBalance: () => Promise<void>;
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

  const refreshBalance = async () => {
    if (!wallet) return;

    try {
      const { data, error } = await supabase.functions.invoke('hedera-get-balance', {
        body: { accountId: wallet.accountId }
      });

      if (error) throw error;

      if (data?.success) {
        const updatedWallet = {
          ...wallet,
          balance: data.hbarBalance,
          tokenBalances: data.tokenBalances
        };
        setWallet(updatedWallet);
        localStorage.setItem('hedera_wallet', JSON.stringify(updatedWallet));
      }
    } catch (error: any) {
      console.error('Error refreshing balance:', error);
    }
  };

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
            network: 'testnet',
            tokenBalances: {}
          };
          
          setWallet(walletData);
          localStorage.setItem('hedera_wallet', JSON.stringify(walletData));
          
          // Refresh balance after connection
          setTimeout(() => refreshBalance(), 1000);
          
          toast.success('Wallet connected successfully!');
        } else {
          // Fallback to mock wallet for demo
          const mockWallet: HederaWallet = {
            accountId: '0.0.123456',
            balance: '100.00',
            network: 'testnet',
            tokenBalances: {}
          };
          setWallet(mockWallet);
          localStorage.setItem('hedera_wallet', JSON.stringify(mockWallet));
          toast.success('Demo wallet connected! Install HashPack for real testnet transactions.');
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

  const createToken = async (name: string, symbol: string, supply: number): Promise<string | null> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('hedera-create-token', {
        body: {
          tokenName: name,
          tokenSymbol: symbol,
          initialSupply: supply,
          decimals: 2,
          treasuryId: wallet.accountId
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Token ${symbol} created: ${data.tokenId}`);
        await refreshBalance();
        return data.tokenId;
      }

      throw new Error('Token creation failed');
    } catch (error: any) {
      toast.error(`Token creation failed: ${error.message}`);
      return null;
    }
  };

  const transferToken = async (tokenId: string, toAccountId: string, amount: number): Promise<boolean> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('hedera-transfer-token', {
        body: {
          tokenId,
          fromAccountId: wallet.accountId,
          toAccountId,
          amount
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Transferred ${amount} tokens successfully`);
        await refreshBalance();
        return true;
      }

      throw new Error('Transfer failed');
    } catch (error: any) {
      toast.error(`Transfer failed: ${error.message}`);
      return false;
    }
  };

  const sendHBAR = async (recipient: string, amount: number): Promise<boolean> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      // In production with HashPack, this would trigger wallet signing
      toast.success(`Use HashPack to send ${amount} HBAR to ${recipient}`);
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
      sendHBAR,
      createToken,
      transferToken,
      refreshBalance
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
