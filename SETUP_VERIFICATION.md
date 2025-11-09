# Setup Verification Checklist

## Pre-Deployment Checklist

### 1. Development Environment
- [ ] Node.js 18+ installed
- [ ] Rust toolchain installed (`rustc --version`)
- [ ] Stellar CLI installed (`stellar --version`)
- [ ] Scaffold Stellar CLI installed (`stellar-scaffold --version`)
- [ ] Freighter wallet browser extension installed

### 2. Stellar Account Setup
- [ ] Test account generated (`stellar keys generate alice --network testnet`)
- [ ] Account funded with XLM (`stellar keys fund alice --network testnet`)
- [ ] Account shows in Freighter wallet
- [ ] Freighter switched to testnet network

### 3. Contract Deployment
```bash
# Verify you're in the project root
pwd

# Build contracts
stellar contract build

# Expected output: WASM files in target/wasm32-unknown-unknown/release/
ls -la target/wasm32-unknown-unknown/release/*.wasm

# Deploy contracts (this will take a few minutes)
./scripts/deploy-contracts.sh

# Verify .env.local was created with contract IDs
cat .env.local

# Expected output:
# VITE_STELLAR_PAYMENT_CONTRACT_ID=CA...
# VITE_STELLAR_VOUCHER_CONTRACT_ID=CA...
# VITE_STELLAR_INET_TOKEN_ID=CA...
# VITE_STELLAR_ADMIN_ADDRESS=G...

# Copy to .env
cat .env.local >> .env
```

### 4. Frontend Setup
```bash
# Install dependencies
npm install

# Verify environment variables
cat .env | grep STELLAR

# Expected output should show all 4 STELLAR variables

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

## Post-Deployment Verification

### 1. Wallet Connection
- [ ] Navigate to the app homepage
- [ ] Click "Connect Wallet" in the top right
- [ ] Freighter popup appears
- [ ] Approve connection
- [ ] Your public key shows in the button (truncated)
- [ ] XLM balance displays correctly

### 2. Purchase Flow Test
- [ ] Navigate to "Plans" page
- [ ] Select any plan (e.g., "Browsing Pro")
- [ ] Click "Purchase"
- [ ] Payment modal opens with Stellar tab as default
- [ ] Wallet shows connected address
- [ ] Price displayed in XLM
- [ ] Click "Pay X XLM"
- [ ] Freighter shows transaction to approve
- [ ] Transaction details show contract call
- [ ] Click "Approve" in Freighter
- [ ] Success toast appears with transaction hash
- [ ] Voucher appears in "My Vouchers" page

### 3. Voucher Activation Test
- [ ] Navigate to "My Vouchers" page
- [ ] See the voucher you just purchased (inactive)
- [ ] Click "Activate Voucher"
- [ ] Freighter prompts for signature
- [ ] Approve transaction
- [ ] Voucher status changes to "Active"
- [ ] Progress bar shows remaining time
- [ ] Token rewards calculation displays

### 4. Admin Voucher Minting Test
- [ ] Navigate to "Admin" → "Vouchers"
- [ ] Click "Generate Voucher"
- [ ] Modal opens with plan selection
- [ ] Select a plan (e.g., "Power Basic")
- [ ] Enter recipient address (your public key or another testnet address)
- [ ] Click "Mint Voucher"
- [ ] Freighter shows minting transaction
- [ ] Approve transaction
- [ ] Success toast with TX hash
- [ ] New voucher appears in vouchers table

## Troubleshooting

### Contract Not Configured Error
**Problem**: "Contracts not configured. Please deploy contracts first."

**Solution**:
```bash
# Verify .env has contract IDs
cat .env | grep STELLAR

# If missing, check .env.local
cat .env.local

# Re-run deployment if needed
./scripts/deploy-contracts.sh

# Copy to .env
cat .env.local >> .env

# Restart dev server
npm run dev
```

### Freighter Not Detected
**Problem**: "Please install Freighter wallet extension"

**Solution**:
1. Install Freighter: https://www.freighter.app/
2. Create/import account
3. Switch to "Testnet" in settings
4. Refresh the page
5. Click "Connect Wallet"

### Transaction Failed
**Problem**: Transaction fails with "insufficient balance"

**Solution**:
```bash
# Fund your account with more testnet XLM
stellar keys fund alice --network testnet

# Wait 5 seconds for funding
# Try transaction again
```

### Wrong Network
**Problem**: Transactions fail or wallet shows 0 XLM

**Solution**:
1. Open Freighter
2. Click settings (gear icon)
3. Select "Network"
4. Choose "Testnet"
5. Verify balance updates
6. Reconnect wallet on the site

## Contract Interaction Verification

### Check Payment Contract
```bash
# Get contract ID
export PAYMENT_CONTRACT=$(grep PAYMENT_CONTRACT_ID .env | cut -d'=' -f2)

# View contract info
stellar contract info id $PAYMENT_CONTRACT --network testnet
```

### Check Voucher Contract
```bash
# Get contract ID
export VOUCHER_CONTRACT=$(grep VOUCHER_CONTRACT_ID .env | cut -d'=' -f2)

# View contract info
stellar contract info id $VOUCHER_CONTRACT --network testnet
```

### Check INET Token Contract
```bash
# Get contract ID
export TOKEN_CONTRACT=$(grep INET_TOKEN_ID .env | cut -d'=' -f2)

# View contract info
stellar contract info id $TOKEN_CONTRACT --network testnet
```

## Demo Script for Judges

### Quick Demo (5 minutes)
1. **Show Wallet Integration** (30 sec)
   - Click "Connect Wallet"
   - Show Freighter popup and approval
   - Display connected address and balance

2. **Purchase a Plan** (2 min)
   - Navigate to Plans
   - Select "Browsing Pro"
   - Show Stellar payment tab (default)
   - Approve transaction in Freighter
   - Show success message with TX hash

3. **Activate Voucher** (1 min)
   - Go to Vouchers
   - Click "Activate" on purchased voucher
   - Sign activation transaction
   - Show active status with countdown

4. **Admin Minting** (1.5 min)
   - Go to Admin → Vouchers
   - Click "Generate Voucher"
   - Select plan and recipient
   - Mint on blockchain
   - Show voucher in table

### Technical Walkthrough (10 minutes)
Include:
- Smart contract code review (Rust)
- Frontend integration code (`useStellarContracts.ts`)
- Transaction flow diagram
- Scaffold Stellar benefits demonstration
- TypeScript bindings showcase

## Success Criteria

All checkboxes should be checked for successful setup:

**Contracts**: ✅
- [ ] All 3 contracts deployed to testnet
- [ ] Contract IDs in .env
- [ ] Contracts callable from CLI

**Frontend**: ✅
- [ ] App runs on localhost
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Wallet button visible

**Integration**: ✅
- [ ] Wallet connects successfully
- [ ] Plans page loads with pricing
- [ ] Payment modal defaults to Stellar
- [ ] Transactions can be signed

**Blockchain**: ✅
- [ ] Purchase creates on-chain payment
- [ ] Voucher mints as NFT
- [ ] Activation updates blockchain state
- [ ] Admin can mint vouchers

---

**All green? You're ready to demo! 🚀**

For support, check:
- `STELLAR_INTEGRATION.md` for architecture details
- `contracts/README.md` for contract documentation
- Scaffold Stellar docs: https://scaffoldstellar.org/
