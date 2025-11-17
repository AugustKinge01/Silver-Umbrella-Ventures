# OneChain Migration - Corrected Plan

## Critical Discovery
OneChain is **NOT EVM-compatible**. It's a Sui fork that uses:
- **Move programming language** for smart contracts (NOT Solidity)
- **Object-based model** (NOT account-based like Ethereum)
- **Sui SDK** for integration
- **OneWallet** browser extension (similar to Freighter/MetaMask)

## What Was Wrong
❌ Created Solidity contracts (.sol files)
❌ Used ethers.js and EVM patterns
❌ Assumed account-based blockchain model

## What Needs To Be Done

### 1. Smart Contracts (Move Language)
- **contracts/move/inet_token/** - Move package for INET token
- **contracts/move/payment/** - Move package for payment escrow
- **contracts/move/voucher/** - Move package for voucher NFTs
- Use `one::` imports (OneChain's fork of Sui framework)

### 2. Frontend Integration
- Install `@mysten/sui.js` or OneChain's SDK
- Create `OneChainContext.tsx` that:
  - Detects OneWallet extension (window.oneWallet)
  - Connects wallet and gets address
  - Signs and submits transactions using Sui SDK patterns
- Replace Web3Context completely

### 3. Deployment
- Use OneChain CLI tools (similar to Sui CLI)
- Deploy Move packages to OneChain testnet
- Get package IDs and update environment variables

## Key Differences from Ethereum
- No gas fees in ONE tokens (uses object-based model)
- Transactions are object manipulations, not contract calls
- No msg.sender - use tx_context
- Objects have unique IDs and ownership
- Programmable Transaction Blocks (PTBs) instead of simple transactions

## Next Steps
1. Delete all Solidity contracts
2. Create Move contract structure
3. Implement OneWallet integration
4. Update PlanContext to use Move contract calls
5. Test with OneChain testnet
