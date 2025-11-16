import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from 'sonner';

// Contract addresses (will be populated after deployment)
const CONTRACT_ADDRESSES = {
  INET_TOKEN: import.meta.env.VITE_INET_TOKEN_ADDRESS || '',
  PAYMENT_ESCROW: import.meta.env.VITE_PAYMENT_CONTRACT_ADDRESS || '',
  VOUCHER_NFT: import.meta.env.VITE_VOUCHER_CONTRACT_ADDRESS || '',
};

// ABI fragments for contract interactions
const INET_TOKEN_ABI = [
  'function mint(address to, uint256 amount) external',
  'function burn(address from, uint256 amount) external',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

const PAYMENT_ESCROW_ABI = [
  'function createPayment(string planId, uint256 amount, address tokenAddress) payable returns (uint256)',
  'function completePayment(uint256 paymentId) external',
  'function getPayment(uint256 paymentId) view returns (tuple(uint256 id, address buyer, string planId, uint256 amount, address tokenAddress, uint8 status, uint256 timestamp))',
];

const VOUCHER_NFT_ABI = [
  'function mintVoucher(string planId, string code, uint256 durationHours, address owner) returns (uint256)',
  'function activateVoucher(uint256 voucherId) external',
  'function getVoucher(uint256 voucherId) view returns (tuple(uint256 id, string planId, string code, uint256 durationHours, bool isActive, uint256 createdAt, uint256 activatedAt, address originalOwner))',
  'function ownerOf(uint256 tokenId) view returns (address)',
];

export const useOneChainContracts = () => {
  const { wallet } = useWeb3();
  const [isProcessing, setIsProcessing] = useState(false);

  // Purchase a plan with native token or INET token
  const purchasePlan = async (
    planId: string,
    amount: string,
    useNativeToken: boolean = true
  ): Promise<string | null> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return null;
    }

    setIsProcessing(true);
    try {
      const paymentEscrow = new ethers.Contract(
        CONTRACT_ADDRESSES.PAYMENT_ESCROW,
        PAYMENT_ESCROW_ABI,
        wallet.signer
      );

      const amountWei = ethers.parseEther(amount);
      const tokenAddress = useNativeToken
        ? ethers.ZeroAddress
        : CONTRACT_ADDRESSES.INET_TOKEN;

      let tx;
      if (useNativeToken) {
        // Pay with native ONE token
        tx = await paymentEscrow.createPayment(planId, amountWei, tokenAddress, {
          value: amountWei,
        });
      } else {
        // Pay with INET token (need approval first)
        const inetToken = new ethers.Contract(
          CONTRACT_ADDRESSES.INET_TOKEN,
          INET_TOKEN_ABI,
          wallet.signer
        );

        // Approve payment escrow to spend INET tokens
        const approveTx = await inetToken.transfer(
          CONTRACT_ADDRESSES.PAYMENT_ESCROW,
          amountWei
        );
        await approveTx.wait();

        tx = await paymentEscrow.createPayment(planId, amountWei, tokenAddress);
      }

      const receipt = await tx.wait();
      
      // Extract payment ID from event logs
      const paymentId = receipt.logs[0]?.topics[1] || '0';
      
      toast.success('Plan purchased successfully!');
      return paymentId;
    } catch (error: any) {
      console.error('Purchase failed:', error);
      toast.error(error.message || 'Purchase failed');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Mint a voucher NFT
  const mintVoucher = async (
    planId: string,
    code: string,
    durationHours: number,
    ownerAddress?: string
  ): Promise<string | null> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return null;
    }

    setIsProcessing(true);
    try {
      const voucherNFT = new ethers.Contract(
        CONTRACT_ADDRESSES.VOUCHER_NFT,
        VOUCHER_NFT_ABI,
        wallet.signer
      );

      const owner = ownerAddress || wallet.address;
      const tx = await voucherNFT.mintVoucher(planId, code, durationHours, owner);
      const receipt = await tx.wait();

      // Extract voucher ID from event logs
      const voucherId = receipt.logs[0]?.topics[1] || '0';

      toast.success('Voucher minted successfully!');
      return voucherId;
    } catch (error: any) {
      console.error('Mint voucher failed:', error);
      toast.error(error.message || 'Failed to mint voucher');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Activate a voucher
  const activateVoucher = async (voucherId: string): Promise<boolean> => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setIsProcessing(true);
    try {
      const voucherNFT = new ethers.Contract(
        CONTRACT_ADDRESSES.VOUCHER_NFT,
        VOUCHER_NFT_ABI,
        wallet.signer
      );

      const tx = await voucherNFT.activateVoucher(voucherId);
      await tx.wait();

      toast.success('Voucher activated successfully!');
      return true;
    } catch (error: any) {
      console.error('Activate voucher failed:', error);
      toast.error(error.message || 'Failed to activate voucher');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Get INET token balance
  const getINETBalance = async (): Promise<string> => {
    if (!wallet) return '0';

    try {
      const inetToken = new ethers.Contract(
        CONTRACT_ADDRESSES.INET_TOKEN,
        INET_TOKEN_ABI,
        wallet.provider
      );

      const balance = await inetToken.balanceOf(wallet.address);
      return ethers.formatUnits(balance, 8); // INET has 8 decimals
    } catch (error) {
      console.error('Failed to get INET balance:', error);
      return '0';
    }
  };

  return {
    purchasePlan,
    mintVoucher,
    activateVoucher,
    getINETBalance,
    isProcessing,
    contractAddresses: CONTRACT_ADDRESSES,
  };
};
