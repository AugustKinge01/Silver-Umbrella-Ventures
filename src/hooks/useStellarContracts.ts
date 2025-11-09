import { useStellar } from "@/contexts/StellarContext";
import { toast } from "sonner";
import * as StellarSdk from "@stellar/stellar-sdk";

// Contract addresses from environment
const INET_TOKEN_ID = import.meta.env.VITE_STELLAR_INET_TOKEN_ID;
const PAYMENT_CONTRACT_ID = import.meta.env.VITE_STELLAR_PAYMENT_CONTRACT_ID;
const VOUCHER_CONTRACT_ID = import.meta.env.VITE_STELLAR_VOUCHER_CONTRACT_ID;

// Stellar network configuration
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const HORIZON_URL = "https://horizon-testnet.stellar.org";

export const useStellarContracts = () => {
  const { wallet } = useStellar();

  const purchasePlanWithStellar = async (
    planId: string,
    amount: string,
    priceInXLM: number
  ): Promise<boolean> => {
    if (!wallet) {
      toast.error("Please connect your Stellar wallet first");
      return false;
    }

    if (!PAYMENT_CONTRACT_ID || !INET_TOKEN_ID) {
      toast.error("Contracts not configured. Please deploy contracts first.");
      console.error("Missing contract environment variables");
      return false;
    }

    try {
      toast.info("Creating payment on Stellar blockchain...");
      
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const sourceAccount = await server.loadAccount(wallet.publicKey);
      
      // Convert price to stroops (1 XLM = 10,000,000 stroops)
      const amountInStroops = Math.floor(priceInXLM * 10_000_000);
      
      // Build contract invocation transaction
      const contract = new StellarSdk.Contract(PAYMENT_CONTRACT_ID);
      
      // Call create_payment function on the contract
      const operation = contract.call(
        "create_payment",
        StellarSdk.nativeToScVal(wallet.publicKey, { type: "address" }),
        StellarSdk.nativeToScVal(planId, { type: "string" }),
        StellarSdk.nativeToScVal(amountInStroops, { type: "i128" }),
        StellarSdk.nativeToScVal(INET_TOKEN_ID, { type: "address" })
      );

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // Request signature from Freighter wallet
      const signedTransaction = await (window as any).freighter.signTransaction(
        transaction.toXDR(),
        { networkPassphrase: NETWORK_PASSPHRASE }
      );

      // Submit transaction
      const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
        signedTransaction,
        NETWORK_PASSPHRASE
      );
      
      const response = await server.submitTransaction(transactionToSubmit);
      
      if (response.successful) {
        toast.success(`Plan purchased! Transaction: ${response.hash.slice(0, 8)}...`);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Plan purchase error:", error);
      toast.error("Failed to purchase plan: " + (error.message || "Unknown error"));
      return false;
    }
  };

  const mintVoucher = async (
    planId: string,
    code: string,
    durationHours: number,
    ownerAddress: string
  ): Promise<string | null> => {
    if (!wallet) {
      toast.error("Please connect your Stellar wallet first");
      return null;
    }

    if (!VOUCHER_CONTRACT_ID) {
      toast.error("Voucher contract not configured. Please deploy contracts first.");
      return null;
    }

    try {
      toast.info("Minting voucher NFT on Stellar blockchain...");
      
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const sourceAccount = await server.loadAccount(wallet.publicKey);
      
      // Build contract invocation transaction
      const contract = new StellarSdk.Contract(VOUCHER_CONTRACT_ID);
      
      // Call mint_voucher function on the contract
      const operation = contract.call(
        "mint_voucher",
        StellarSdk.nativeToScVal(wallet.publicKey, { type: "address" }), // admin
        StellarSdk.nativeToScVal(ownerAddress, { type: "address" }), // owner
        StellarSdk.nativeToScVal(planId, { type: "string" }),
        StellarSdk.nativeToScVal(code, { type: "string" }),
        StellarSdk.nativeToScVal(durationHours, { type: "u32" })
      );

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // Request signature from Freighter wallet
      const signedTransaction = await (window as any).freighter.signTransaction(
        transaction.toXDR(),
        { networkPassphrase: NETWORK_PASSPHRASE }
      );

      // Submit transaction
      const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
        signedTransaction,
        NETWORK_PASSPHRASE
      );
      
      const response = await server.submitTransaction(transactionToSubmit);
      
      if (response.successful) {
        // Return voucher ID - will be returned by the contract
        const voucherId = `${Date.now()}`;
        
        toast.success(`Voucher minted! TX: ${response.hash.slice(0, 8)}...`);
        return voucherId;
      }
      
      return null;
    } catch (error: any) {
      console.error("Voucher mint error:", error);
      toast.error("Failed to mint voucher: " + (error.message || "Unknown error"));
      return null;
    }
  };

  const activateVoucherOnChain = async (
    voucherId: number
  ): Promise<boolean> => {
    if (!wallet) {
      toast.error("Please connect your Stellar wallet first");
      return false;
    }

    if (!VOUCHER_CONTRACT_ID) {
      toast.error("Voucher contract not configured.");
      return false;
    }

    try {
      toast.info("Activating voucher on Stellar blockchain...");
      
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const sourceAccount = await server.loadAccount(wallet.publicKey);
      
      const contract = new StellarSdk.Contract(VOUCHER_CONTRACT_ID);
      
      const operation = contract.call(
        "activate_voucher",
        StellarSdk.nativeToScVal(voucherId, { type: "u64" }),
        StellarSdk.nativeToScVal(wallet.publicKey, { type: "address" })
      );

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      const signedTransaction = await (window as any).freighter.signTransaction(
        transaction.toXDR(),
        { networkPassphrase: NETWORK_PASSPHRASE }
      );

      const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
        signedTransaction,
        NETWORK_PASSPHRASE
      );
      
      const response = await server.submitTransaction(transactionToSubmit);
      
      if (response.successful) {
        toast.success("Voucher activated on blockchain!");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Voucher activation error:", error);
      toast.error("Failed to activate voucher: " + (error.message || "Unknown error"));
      return false;
    }
  };

  const getTokenBalance = async (tokenId?: string): Promise<string> => {
    if (!wallet) return "0";

    const targetTokenId = tokenId || INET_TOKEN_ID;
    if (!targetTokenId) return "0";

    try {
      // Check if token balance exists in wallet
      const tokenKey = Object.keys(wallet.tokenBalances || {}).find(key => 
        key.includes(targetTokenId)
      );

      if (tokenKey && wallet.tokenBalances) {
        return wallet.tokenBalances[tokenKey];
      }

      return "0";
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return "0";
    }
  };

  return {
    purchasePlanWithStellar,
    mintVoucher,
    activateVoucherOnChain,
    getTokenBalance,
    contractAddresses: {
      inetToken: INET_TOKEN_ID,
      payment: PAYMENT_CONTRACT_ID,
      voucher: VOUCHER_CONTRACT_ID,
    },
  };
};
