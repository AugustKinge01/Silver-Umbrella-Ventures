import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as StellarSdk from '@stellar/stellar-sdk';
import freighter from '@stellar/freighter-api';

type StellarWallet = {
  publicKey: string;
  balance: string;
  network: 'testnet' | 'mainnet';
  tokenBalances?: Record<string, string>;
};

type StellarContextType = {
  wallet: StellarWallet | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendPayment: (recipient: string, amount: string) => Promise<boolean>;
  createToken: (name: string, code: string, limit: string) => Promise<string | null>;
  refreshBalance: () => Promise<void>;
};

const StellarContext = createContext<StellarContextType | undefined>(undefined);

// Testnet configuration
const STELLAR_NETWORK = 'TESTNET';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export const StellarProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<StellarWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check for existing wallet connection
    const savedWallet = localStorage.getItem('stellar_wallet');
    if (savedWallet) {
      const parsedWallet = JSON.parse(savedWallet);
      setWallet(parsedWallet);
      // Auto-refresh balance
      refreshBalanceForWallet(parsedWallet.publicKey);
    }
  }, []);

  const refreshBalanceForWallet = async (publicKey: string) => {
    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const account = await server.loadAccount(publicKey);
      
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );
      
      const tokenBalances: Record<string, string> = {};
      account.balances.forEach((balance: any) => {
        if (balance.asset_type !== 'native') {
          const key = `${balance.asset_code}:${balance.asset_issuer}`;
          tokenBalances[key] = balance.balance;
        }
      });

      const updatedWallet: StellarWallet = {
        publicKey,
        balance: xlmBalance?.balance || '0',
        network: 'testnet',
        tokenBalances
      };

      setWallet(updatedWallet);
      localStorage.setItem('stellar_wallet', JSON.stringify(updatedWallet));
    } catch (error: any) {
      console.error('Error refreshing balance:', error);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;
    await refreshBalanceForWallet(wallet.publicKey);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if Freighter is installed
      const connected = await freighter.isConnected();
      
      if (!connected) {
        toast.error('Please install Freighter wallet extension');
        window.open('https://freighter.app/', '_blank');
        setIsConnecting(false);
        return;
      }

      // Get address
      const addressResult = await freighter.getAddress();
      
      if (!addressResult.address) {
        toast.error('Failed to get address from Freighter');
        setIsConnecting(false);
        return;
      }

      // Load account and get balance
      await refreshBalanceForWallet(addressResult.address);
      
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
    localStorage.removeItem('stellar_wallet');
    toast.info('Wallet disconnected');
  };

  const sendPayment = async (recipient: string, amount: string): Promise<boolean> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const sourceAccount = await server.loadAccount(wallet.publicKey);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: recipient,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(180)
        .build();

      const xdr = transaction.toXDR();
      
      // Sign with Freighter
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: StellarSdk.Networks.TESTNET,
      });

      // Submit transaction
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        StellarSdk.Networks.TESTNET
      );
      
      const result = await server.submitTransaction(signedTransaction);
      
      toast.success(`Payment sent! Transaction: ${result.hash.substring(0, 8)}...`);
      await refreshBalance();
      return true;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Payment failed: ' + error.message);
      return false;
    }
  };

  const createToken = async (name: string, code: string, limit: string): Promise<string | null> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return null;
    }

    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const issuerAccount = await server.loadAccount(wallet.publicKey);

      const asset = new StellarSdk.Asset(code, wallet.publicKey);

      const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: asset,
            limit: limit,
          })
        )
        .setTimeout(180)
        .build();

      const xdr = transaction.toXDR();
      
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: StellarSdk.Networks.TESTNET,
      });

      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        StellarSdk.Networks.TESTNET
      );
      
      const result = await server.submitTransaction(signedTransaction);
      
      const tokenId = `${code}:${wallet.publicKey}`;
      toast.success(`Token ${code} created!`);
      await refreshBalance();
      return tokenId;
    } catch (error: any) {
      toast.error(`Token creation failed: ${error.message}`);
      return null;
    }
  };

  return (
    <StellarContext.Provider value={{ 
      wallet, 
      isConnecting, 
      connectWallet, 
      disconnectWallet,
      sendPayment,
      createToken,
      refreshBalance
    }}>
      {children}
    </StellarContext.Provider>
  );
};

export const useStellar = () => {
  const context = useContext(StellarContext);
  if (context === undefined) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
};
