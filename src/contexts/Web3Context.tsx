import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

// OneChain Network Configuration
const ONECHAIN_TESTNET = {
  chainId: '0x3E9', // 1001 in hex
  chainName: 'OneChain Testnet',
  nativeCurrency: {
    name: 'ONE',
    symbol: 'ONE',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.onechain.network'],
  blockExplorerUrls: ['https://testnet-explorer.onechain.network'],
};

interface WalletInfo {
  address: string;
  balance: string; // Native token balance in ONE
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}

interface Web3ContextType {
  wallet: WalletInfo | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToOneChain: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    };
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const switchToOneChain = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask or OneWallet');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ONECHAIN_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ONECHAIN_TESTNET],
          });
        } catch (addError) {
          throw new Error('Failed to add OneChain network');
        }
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask or OneWallet');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Switch to OneChain if needed
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== ONECHAIN_TESTNET.chainId) {
        await switchToOneChain();
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get balance
      const balance = await provider.getBalance(address);
      const balanceInONE = ethers.formatEther(balance);

      setWallet({
        address,
        balance: balanceInONE,
        provider,
        signer,
      });

      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    toast.info('Wallet disconnected');
  };

  const refreshBalance = async () => {
    if (!wallet) return;

    try {
      const balance = await wallet.provider.getBalance(wallet.address);
      const balanceInONE = ethers.formatEther(balance);

      setWallet((prev) => (prev ? { ...prev, balance: balanceInONE } : null));
      toast.success('Balance updated');
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      toast.error('Failed to refresh balance');
    }
  };

  return (
    <Web3Context.Provider
      value={{
        wallet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchToOneChain,
        refreshBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
