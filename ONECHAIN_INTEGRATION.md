# OneChain Integration - Silver Umbrella

## ✅ Corrected Implementation

OneChain uses **Move language** (Sui-based), NOT Solidity/EVM.

## Smart Contracts (Move)
- **contracts/move/inet_token/** - INET token (Coin standard)
- **contracts/move/payment/** - Payment escrow
- **contracts/move/voucher/** - Voucher NFTs

## Frontend Integration
- **src/contexts/OneChainContext.tsx** - OneWallet connection
- **src/components/OneChainWalletButton.tsx** - Wallet UI
- **src/hooks/useOneChainContracts.ts** - Contract interactions

## Next Steps
1. Deploy Move contracts to OneChain testnet
2. Update .env with Package IDs
3. Test with OneWallet extension
4. Complete hackathon submission

See **ONECHAIN_DEPLOYMENT.md** for detailed deployment instructions.
