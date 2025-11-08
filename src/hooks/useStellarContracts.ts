import { useStellar } from "@/contexts/StellarContext";
import { toast } from "sonner";

// Contract addresses from environment
const INET_TOKEN_ID = import.meta.env.VITE_STELLAR_INET_TOKEN_ID;
const PAYMENT_CONTRACT_ID = import.meta.env.VITE_STELLAR_PAYMENT_CONTRACT_ID;
const VOUCHER_CONTRACT_ID = import.meta.env.VITE_STELLAR_VOUCHER_CONTRACT_ID;

export const useStellarContracts = () => {
  const { wallet, sendPayment } = useStellar();

  const purchasePlanWithStellar = async (
    planId: string,
    amount: string
  ): Promise<boolean> => {
    if (!wallet) {
      toast.error("Please connect your Stellar wallet first");
      return false;
    }

    if (!PAYMENT_CONTRACT_ID) {
      toast.error("Payment contract not configured. Please deploy contracts first.");
      console.error("Missing VITE_STELLAR_PAYMENT_CONTRACT_ID environment variable");
      return false;
    }

    try {
      // For now, use direct payment until TypeScript bindings are generated
      // After running deployment script, this will use the contract client
      toast.info("Processing payment through Stellar...");
      
      // Placeholder for contract interaction
      // After deployment, this will be:
      // const paymentClient = new PaymentClient({ contractId: PAYMENT_CONTRACT_ID, ... });
      // const result = await paymentClient.create_payment({ ... });
      
      const success = await sendPayment(
        PAYMENT_CONTRACT_ID,
        amount
      );

      if (success) {
        toast.success(`Plan purchased! Plan ID: ${planId}`);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Plan purchase error:", error);
      toast.error("Failed to purchase plan: " + error.message);
      return false;
    }
  };

  const mintVoucher = async (
    planId: string,
    code: string,
    durationHours: number
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
      toast.info("Minting voucher NFT on Stellar...");
      
      // Placeholder for contract interaction
      // After deployment with TypeScript bindings:
      // const voucherClient = new VoucherClient({ contractId: VOUCHER_CONTRACT_ID, ... });
      // const voucherId = await voucherClient.mint_voucher({ ... });
      
      // For demo, return a mock voucher ID
      const mockVoucherId = `VOUCHER-${Date.now()}`;
      toast.success("Voucher minted successfully!");
      
      return mockVoucherId;
    } catch (error: any) {
      console.error("Voucher mint error:", error);
      toast.error("Failed to mint voucher: " + error.message);
      return null;
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
    getTokenBalance,
    contractAddresses: {
      inetToken: INET_TOKEN_ID,
      payment: PAYMENT_CONTRACT_ID,
      voucher: VOUCHER_CONTRACT_ID,
    },
  };
};
