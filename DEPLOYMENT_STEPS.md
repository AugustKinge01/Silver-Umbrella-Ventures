# 🚀 Quick Deployment Guide - OneChain

## Step 1: Install Dependencies (2 minutes)

```bash
# Install frontend dependencies
npm install

# Install contract dependencies
cd contracts/solidity
npm install
cd ../..
```

## Step 2: Get OneChain Testnet Tokens (3 minutes)

1. Install MetaMask browser extension
2. Create a new wallet or import existing
3. **Save your private key securely** (you'll need it for deployment)
4. Add OneChain Testnet to MetaMask:
   - Network Name: OneChain Testnet
   - RPC URL: `https://testnet-rpc.onechain.network`
   - Chain ID: `1001`
   - Currency Symbol: `ONE`
   - Block Explorer: `https://testnet-explorer.onechain.network`

5. Get testnet tokens from faucet:
   - Visit: `https://faucet.onechain.network` (or ask in OneChain Discord)
   - Enter your wallet address
   - Receive testnet ONE tokens

## Step 3: Configure Environment (2 minutes)

Create `contracts/solidity/.env`:
```env
PRIVATE_KEY=your_private_key_without_0x_prefix
ONECHAIN_TESTNET_RPC=https://testnet-rpc.onechain.network
```

⚠️ **IMPORTANT:** Never commit your `.env` file or share your private key!

## Step 4: Deploy Smart Contracts (5 minutes)

```bash
cd contracts/solidity

# Compile contracts
npm run compile

# Deploy to OneChain Testnet
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Starting Silver Umbrella contract deployment to OneChain...

Deploying contracts with account: 0x...
Account balance: ... 

📦 Deploying INET Token...
✅ INET Token deployed to: 0xAbC123...

📦 Deploying Payment Escrow...
✅ Payment Escrow deployed to: 0xDef456...

📦 Deploying Voucher NFT...
✅ Voucher NFT deployed to: 0xGhi789...

============================================================
🎉 DEPLOYMENT COMPLETE!
============================================================

📝 Contract Addresses:
INET Token:       0xAbC123...
Payment Escrow:   0xDef456...
Voucher NFT:      0xGhi789...

💾 Add these to your .env file:
VITE_INET_TOKEN_ADDRESS=0xAbC123...
VITE_PAYMENT_CONTRACT_ADDRESS=0xDef456...
VITE_VOUCHER_CONTRACT_ADDRESS=0xGhi789...
```

## Step 5: Update Frontend Configuration (1 minute)

Copy the contract addresses and add them to your root `.env` file:

```bash
# Go back to project root
cd ../..

# Add to .env file
echo "VITE_INET_TOKEN_ADDRESS=0xAbC123..." >> .env
echo "VITE_PAYMENT_CONTRACT_ADDRESS=0xDef456..." >> .env
echo "VITE_VOUCHER_CONTRACT_ADDRESS=0xGhi789..." >> .env
```

## Step 6: Run the App (1 minute)

```bash
npm run dev
```

Visit: `http://localhost:5173`

## Step 7: Test the Integration (5 minutes)

1. **Connect Wallet:**
   - Click "Connect Wallet" button
   - Approve connection in MetaMask
   - App should auto-switch to OneChain Testnet

2. **Purchase a Plan:**
   - Navigate to "Plans" page
   - Select a plan (e.g., "Basic Internet")
   - Click "Purchase"
   - Choose payment method (ONE tokens)
   - Confirm transaction in MetaMask

3. **View Voucher:**
   - Navigate to "Vouchers" page
   - See your newly minted voucher NFT
   - Activate it by clicking "Activate"

4. **Check Wallet:**
   - Click on your wallet button (top right)
   - View your ONE balance
   - Refresh balance if needed

## 🎥 Step 8: Record Demo Video (15 minutes)

Record a 3-minute demo showing:
1. **App Overview** (30s)
   - Show landing page
   - Explain Silver Umbrella DePIN concept

2. **Wallet Connection** (30s)
   - Connect OneWallet/MetaMask
   - Show auto-switch to OneChain

3. **Plan Purchase** (60s)
   - Browse plans
   - Purchase a plan
   - Show transaction confirmation

4. **Voucher Management** (60s)
   - View minted voucher NFT
   - Activate voucher
   - Show on-chain verification

**Recording Tips:**
- Use OBS Studio or Loom
- Show your face (optional but recommended)
- Keep it under 3 minutes
- Highlight OneChain integration
- Show the DePIN use case clearly

## 📝 Step 9: Prepare Submission (10 minutes)

### GitHub Repository
Ensure your repo includes:
- ✅ README.md with project description
- ✅ ONECHAIN_INTEGRATION.md (migration details)
- ✅ Smart contract code in `contracts/solidity/`
- ✅ Deployment scripts
- ✅ Frontend code with Web3 integration

### Submission Form (Fill out on DoraHacks)
Prepare these details:
1. **Project Name:** Silver Umbrella - DePIN for Rural Africa
2. **Category:** RWA / Infrastructure
3. **Description:** 
   ```
   Solar-powered internet & power DePIN network connecting rural Africa.
   Users purchase plans, receive voucher NFTs, and earn INET tokens.
   Built on OneChain with ERC20 tokens, payment escrow, and ERC721 vouchers.
   ```

4. **Tech Stack:**
   - OneChain (Layer 1 blockchain)
   - Solidity smart contracts (ERC20, ERC721, Escrow)
   - React + TypeScript frontend
   - ethers.js for Web3 integration
   - Supabase backend
   - Tailwind CSS + shadcn/ui

5. **OneChain Integration:**
   - 3 deployed smart contracts on OneChain Testnet
   - OneWallet/MetaMask integration
   - Native ONE token payments
   - INET ERC20 token for bandwidth credits
   - Voucher ERC721 NFTs

6. **Contract Addresses:**
   ```
   INET Token: 0x...
   Payment Escrow: 0x...
   Voucher NFT: 0x...
   Network: OneChain Testnet (Chain ID: 1001)
   ```

7. **Demo Video URL:** [Upload to YouTube/Loom and paste link]

8. **GitHub Repo URL:** [Your repo link]

9. **Live Demo URL:** [Deploy to Vercel/Netlify if time permits]

## ✅ Final Checklist

Before submitting:
- [ ] Smart contracts deployed to OneChain Testnet
- [ ] Frontend connects to OneWallet/MetaMask
- [ ] Can purchase plans with ONE tokens
- [ ] Vouchers mint as ERC721 NFTs
- [ ] Demo video recorded (under 3 minutes)
- [ ] GitHub repo is public and complete
- [ ] Submission form filled out
- [ ] All contract addresses documented

## 🆘 Common Issues

### "Insufficient funds for gas"
**Solution:** Get more testnet ONE from faucet

### "Contract not deployed"
**Solution:** Run `npm run deploy:testnet` in `contracts/solidity/`

### "Wrong network"
**Solution:** Let app auto-switch or manually add OneChain Testnet in MetaMask

### "Transaction reverted"
**Solution:** Check you're calling functions with correct parameters

## 🏆 Submission Deadline Tracking

| Day | Task | Time | Status |
|-----|------|------|--------|
| 1 | Deploy contracts | 30 min | ⏳ |
| 1 | Test integration | 1 hour | ⏳ |
| 2 | Record demo | 1 hour | ⏳ |
| 2 | Polish README | 1 hour | ⏳ |
| 3 | Test on mobile | 1 hour | ⏳ |
| 3 | Final testing | 2 hours | ⏳ |
| 4 | Submit to DoraHacks | 30 min | ⏳ |
| 5 | Buffer day | - | ⏳ |

## 🎯 You're Ready!

You now have:
- ✅ 3 Solidity smart contracts on OneChain
- ✅ Working Web3 integration
- ✅ OneWallet/MetaMask support
- ✅ Payment processing with ONE tokens
- ✅ NFT voucher system
- ✅ Complete DePIN application

**Good luck with OneHack 2025!** 🚀
