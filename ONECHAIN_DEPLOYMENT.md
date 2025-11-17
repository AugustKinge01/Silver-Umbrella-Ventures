# OneChain Deployment Guide

## Prerequisites

### 1. Install OneChain CLI
```bash
cargo install --git https://github.com/one-chain-labs/onechain onechain
```

### 2. Install OneWallet Extension
- Chrome: https://chromewebstore.google.com/detail/onewallet/gclmcgmpkgblaglfokkaclneihpnbkli
- Create a wallet and save your mnemonic phrase
- Switch to OneChain Testnet

### 3. Get Testnet Tokens
```bash
# Using CLI
onechain client faucet --address YOUR_WALLET_ADDRESS

# Or through web faucet (if available)
```

## Smart Contract Deployment

### 1. Build Move Packages

#### INET Token
```bash
cd contracts/move/inet_token
onechain move build
```

#### Payment Escrow
```bash
cd contracts/move/payment
onechain move build
```

#### Voucher NFT
```bash
cd contracts/move/voucher
onechain move build
```

### 2. Deploy Contracts

#### Deploy INET Token
```bash
cd contracts/move/inet_token
onechain client publish --gas-budget 100000000
```
Save the Package ID from the output.

#### Deploy Payment Escrow
```bash
cd contracts/move/payment
onechain client publish --gas-budget 100000000
```
Save the Package ID from the output.

#### Deploy Voucher NFT
```bash
cd contracts/move/voucher
onechain client publish --gas-budget 100000000
```
Save the Package ID from the output.

### 3. Update Environment Variables

Create `.env` file in project root:
```env
VITE_INET_TOKEN_PACKAGE=0x... # From INET Token deployment
VITE_PAYMENT_PACKAGE=0x...     # From Payment deployment
VITE_VOUCHER_PACKAGE=0x...     # From Voucher deployment
VITE_ONECHAIN_RPC=https://testnet-rpc.onechain.one
VITE_ONECHAIN_NETWORK=testnet
```

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Test Integration
1. Open app in browser
2. Click "Connect OneWallet"
3. Approve connection in OneWallet extension
4. Try purchasing a plan to test smart contract interaction

## Hackathon Submission Checklist

- [ ] Move smart contracts deployed to OneChain Testnet
- [ ] OneWallet integration working
- [ ] Users can connect wallet and see balance
- [ ] Users can purchase plans with OneChain tokens
- [ ] Transaction confirmation shown after purchase
- [ ] Demo video recorded (max 3 minutes)
- [ ] GitHub repo is public with README
- [ ] Submission form completed

## Troubleshooting

### OneWallet Not Detected
- Make sure OneWallet extension is installed
- Refresh the page after installing
- Check browser console for errors

### Transaction Fails
- Ensure you have enough testnet tokens
- Check gas budget is sufficient
- Verify contract Package IDs are correct in .env

### Contract Build Errors
- Ensure you're using correct OneChain framework version
- Check Move.toml dependencies point to OneChain repo
- Verify syntax matches Move 2024 edition

## Resources
- OneChain Docs: https://docs.onelabs.cc
- OneChain GitHub: https://github.com/one-chain-labs/onechain
- Move Language Book: https://move-language.github.io/move/
- Sui Move Docs (similar to OneChain): https://docs.sui.io/guides/developer/first-app
