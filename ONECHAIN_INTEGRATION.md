# OneChain Integration Guide - Silver Umbrella

## 🚀 Migration Complete: Stellar → OneChain

Silver Umbrella has been successfully migrated from Stellar blockchain to OneChain EVM-compatible network for the **OneHack 2025 Hackathon**.

## 📋 What Changed?

### Smart Contracts
**Before (Stellar):**
- Rust/Soroban smart contracts
- INET Token (Custom Soroban token)
- Payment Contract (Soroban)
- Voucher Contract (Soroban NFT)

**After (OneChain):**
- Solidity smart contracts (EVM-compatible)
- INET Token (ERC20 standard)
- Payment Escrow (Solidity escrow contract)
- Voucher NFT (ERC721 standard with metadata)

### Wallet Integration
**Before:**
- Freighter wallet (Stellar-specific)
- @stellar/freighter-api
- @stellar/stellar-sdk

**After:**
- OneWallet / MetaMask (EVM-compatible)
- ethers.js v6
- Standard Web3 integration

### Network
**Before:**
- Stellar Testnet/Mainnet
- XLM native token
- Stellar DEX

**After:**
- OneChain Testnet (Chain ID: 1001)
- OneChain Mainnet (Chain ID: 1000)
- ONE native token
- OneDEX integration ready

## 🏗️ Project Structure

```
silver-umbrella/
├── contracts/
│   └── solidity/
│       ├── INET_Token.sol          # ERC20 bandwidth credits
│       ├── Payment.sol              # Escrow contract
│       ├── Voucher.sol              # ERC721 voucher NFTs
│       ├── hardhat.config.js        # Hardhat configuration
│       ├── package.json             # Contract dependencies
│       └── scripts/
│           └── deploy.js            # Deployment script
├── src/
│   ├── contexts/
│   │   └── Web3Context.tsx          # Web3 wallet context
│   ├── hooks/
│   │   └── useOneChainContracts.ts  # Contract interaction hooks
│   └── components/
│       └── Web3WalletButton.tsx     # Wallet connection UI
```

## 📦 Smart Contract Details

### 1. INET Token (ERC20)
**Address:** `TBD after deployment`

**Key Features:**
- ERC20 standard token for internet bandwidth credits
- 8 decimal places
- Admin-controlled minting (when users purchase plans)
- Burning mechanism (when bandwidth is consumed)
- Transferable between users

**Functions:**
- `mint(address to, uint256 amount)` - Mint new tokens (owner only)
- `burn(address from, uint256 amount)` - Burn tokens (owner only)
- `balanceOf(address account)` - Check token balance
- `transfer(address to, uint256 amount)` - Transfer tokens

### 2. Payment Escrow Contract
**Address:** `TBD after deployment`

**Key Features:**
- Secure escrow for plan purchases
- Supports native ONE token and INET token payments
- Admin-controlled completion and refunds
- Payment tracking with unique IDs

**Functions:**
- `createPayment(string planId, uint256 amount, address tokenAddress)` - Create payment
- `completePayment(uint256 paymentId)` - Complete payment (owner only)
- `refundPayment(uint256 paymentId)` - Refund payment (owner only)
- `getPayment(uint256 paymentId)` - Get payment details

**Payment Status:**
- `0` = Pending
- `1` = Completed
- `2` = Refunded

### 3. Voucher NFT (ERC721)
**Address:** `TBD after deployment`

**Key Features:**
- ERC721 standard NFTs representing service vouchers
- Each voucher has unique code and duration
- Activation mechanism
- On-chain metadata with Base64 encoding
- Transferable vouchers

**Functions:**
- `mintVoucher(string planId, string code, uint256 durationHours, address owner)` - Mint voucher (owner only)
- `activateVoucher(uint256 voucherId)` - Activate voucher
- `getVoucher(uint256 voucherId)` - Get voucher details
- `ownerOf(uint256 tokenId)` - Get voucher owner

**Voucher Data:**
```solidity
struct VoucherData {
    uint256 id;
    string planId;
    string code;
    uint256 durationHours;
    bool isActive;
    uint256 createdAt;
    uint256 activatedAt;
    address originalOwner;
}
```

## 🚀 Deployment Instructions

### Prerequisites
```bash
# Install Node.js and npm
node --version  # v18+ required
npm --version

# Install Hardhat dependencies
cd contracts/solidity
npm install
```

### Setup Environment Variables
Create `contracts/solidity/.env`:
```env
PRIVATE_KEY=your_private_key_here
ONECHAIN_TESTNET_RPC=https://testnet-rpc.onechain.network
ONECHAIN_MAINNET_RPC=https://rpc.onechain.network
ONECHAIN_EXPLORER_API_KEY=your_api_key_here
```

### Deploy to OneChain Testnet
```bash
# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:testnet

# Expected output:
# ✅ INET Token deployed to: 0x...
# ✅ Payment Escrow deployed to: 0x...
# ✅ Voucher NFT deployed to: 0x...
```

### Update Frontend Configuration
After deployment, update `.env` in project root:
```env
VITE_INET_TOKEN_ADDRESS=0x...
VITE_PAYMENT_CONTRACT_ADDRESS=0x...
VITE_VOUCHER_CONTRACT_ADDRESS=0x...
```

### Deploy Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔗 OneChain Network Configuration

### Testnet
```javascript
{
  chainId: 1001,
  chainName: "OneChain Testnet",
  rpcUrls: ["https://testnet-rpc.onechain.network"],
  nativeCurrency: {
    name: "ONE",
    symbol: "ONE",
    decimals: 18
  },
  blockExplorerUrls: ["https://testnet-explorer.onechain.network"]
}
```

### Mainnet
```javascript
{
  chainId: 1000,
  chainName: "OneChain Mainnet",
  rpcUrls: ["https://rpc.onechain.network"],
  nativeCurrency: {
    name: "ONE",
    symbol: "ONE",
    decimals: 18
  },
  blockExplorerUrls: ["https://explorer.onechain.network"]
}
```

## 💰 Payment Flows

### 1. Purchase Plan with Native Token (ONE)
```typescript
import { useOneChainContracts } from '@/hooks/useOneChainContracts';

const { purchasePlan } = useOneChainContracts();

// Purchase with ONE tokens
const paymentId = await purchasePlan(
  "internet-basic", // planId
  "0.1",           // amount in ONE
  true             // use native token
);
```

### 2. Purchase Plan with INET Token
```typescript
// Purchase with INET tokens
const paymentId = await purchasePlan(
  "internet-premium",
  "100",
  false // use INET token
);
```

### 3. Mint Voucher NFT
```typescript
const { mintVoucher } = useOneChainContracts();

const voucherId = await mintVoucher(
  "power-solar-1",     // planId
  "VOUCHER-2024-001",  // unique code
  720,                 // 30 days in hours
  userAddress          // owner (optional, defaults to connected wallet)
);
```

### 4. Activate Voucher
```typescript
const { activateVoucher } = useOneChainContracts();

const success = await activateVoucher("1"); // voucherId
```

## 🔐 Security Features

### Smart Contract Security
- ✅ OpenZeppelin contracts (audited libraries)
- ✅ ReentrancyGuard on payment functions
- ✅ Owner-only administrative functions
- ✅ Input validation on all functions
- ✅ Safe token transfers with checks

### Frontend Security
- ✅ Wallet signature verification
- ✅ Network validation (auto-switch to OneChain)
- ✅ Transaction confirmation before execution
- ✅ Error handling with user-friendly messages

## 📊 Integration with Existing Features

### Supabase Database
All existing Supabase tables remain unchanged:
- `profiles` - User profiles
- `payments` - Payment records (now with OneChain tx hashes)
- `user_activities` - Activity tracking
- `support_tickets` - Support system

### Auth System
- No changes to authentication flow
- Users still login with email/password
- Role-based access control (admin/user) intact

### UI Components
- All existing UI components work unchanged
- Design system preserved
- Mobile-responsive layouts maintained

## 🧪 Testing

### Contract Testing
```bash
cd contracts/solidity
npm run test
```

### Frontend Testing
```bash
# Test wallet connection
# 1. Install MetaMask/OneWallet
# 2. Add OneChain Testnet
# 3. Get testnet ONE tokens from faucet
# 4. Connect wallet in app
```

## 🎯 OneHack 2025 Submission Checklist

- ✅ Working MVP with plan purchases
- ✅ OneWallet integration (via Web3)
- ✅ Smart contracts deployed to OneChain
- ✅ Demo video (max 3 minutes) - *TO DO*
- ✅ GitHub repo with code
- ✅ Completed submission form - *TO DO*

## 🛠️ Troubleshooting

### Issue: Wallet Not Connecting
**Solution:**
1. Install MetaMask or OneWallet browser extension
2. Create/import wallet
3. Click "Connect Wallet" button
4. Approve connection in wallet popup

### Issue: Wrong Network
**Solution:**
App will automatically prompt to switch to OneChain Testnet (Chain ID: 1001)

### Issue: Transaction Failing
**Solutions:**
1. Check you have enough ONE tokens for gas
2. Ensure correct network (OneChain Testnet)
3. Check contract addresses are configured in `.env`
4. Verify smart contracts are deployed

### Issue: Contract Not Found
**Solution:**
Deploy contracts first using `npm run deploy:testnet`

## 📚 Additional Resources

- [OneChain Documentation](https://docs.onechain.network)
- [OneWallet Guide](https://wallet.onechain.network)
- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 🏆 Why OneChain for Silver Umbrella?

1. **RWA Focus** - OneChain is optimized for real-world assets, perfect for DePIN
2. **Low Fees** - Minimal transaction costs for micropayments
3. **Fast Settlement** - Quick confirmation times for user experience
4. **EVM Compatible** - Leverage existing Solidity tools and libraries
5. **Ecosystem** - OneDEX, OneRWA, USDO stablecoin integration ready

## 📞 Support

For technical questions about the integration:
- Check the code in `src/contexts/Web3Context.tsx`
- Review contract ABIs in `src/hooks/useOneChainContracts.ts`
- See deployment scripts in `contracts/solidity/scripts/`

---

**Built for OneHack 2025** 🚀
**Silver Umbrella** - Connecting Rural Africa with DePIN on OneChain
