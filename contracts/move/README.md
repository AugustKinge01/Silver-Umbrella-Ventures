# Silver Umbrella Move Smart Contracts

## Overview

These are the Move smart contracts for the Silver Umbrella dePIN network, deployed on **OneChain** (a Sui-based Layer-1 blockchain).

## Packages

### 1. INET Token (`inet_token/`)
Utility token for network access payments.

**Key Features:**
- Standard Coin implementation
- 8 decimal precision
- Mint/burn capabilities
- Treasury cap management

**Entry Functions:**
```move
public entry fun mint(
    treasury: &mut TreasuryCap<INET_TOKEN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext
)

public entry fun burn(
    treasury: &mut TreasuryCap<INET_TOKEN>,
    coin: Coin<INET_TOKEN>
)
```

### 2. Payment Escrow (`payment/`)
Secure payment handling for plan purchases.

**Key Features:**
- Escrow-based payments
- Event emission for tracking
- Status management
- Admin completion flow

**Entry Functions:**
```move
public entry fun create_payment(
    payment_coin: Coin<OCT>,
    plan_id: vector<u8>,
    ctx: &mut TxContext
)

public entry fun complete_payment(
    payment: Payment,
    ctx: &mut TxContext
)
```

### 3. Voucher NFT (`voucher/`)
Internet and power access vouchers as NFTs.

**Key Features:**
- Unique voucher codes
- Activation tracking
- Duration management
- Transferability

**Entry Functions:**
```move
public entry fun mint_voucher(
    plan_id: vector<u8>,
    code: vector<u8>,
    duration_hours: u64,
    ctx: &mut TxContext
)

public entry fun activate_voucher(
    voucher: &mut Voucher,
    ctx: &mut TxContext
)

public entry fun transfer_voucher(
    voucher: Voucher,
    recipient: address,
    _ctx: &mut TxContext
)
```

## Building Contracts

### Prerequisites
```bash
# Install OneChain CLI
cargo install --git https://github.com/one-chain-labs/onechain onechain
```

### Build Individual Package
```bash
cd inet_token  # or payment, or voucher
onechain move build
```

### Build All Packages
```bash
# From contracts/move directory
for dir in */; do
  cd "$dir"
  onechain move build
  cd ..
done
```

## Testing Contracts

### Run Tests
```bash
cd inet_token  # or payment, or voucher
onechain move test
```

### Run Tests with Coverage
```bash
onechain move test --coverage
```

## Deploying Contracts

### 1. Get Testnet Tokens
```bash
onechain client faucet --address YOUR_ADDRESS
```

### 2. Deploy Package
```bash
cd inet_token  # or payment, or voucher
onechain client publish --gas-budget 100000000
```

### 3. Save Package IDs
After deployment, save the Package ID displayed in the output:
```
Successfully published package at: 0x1234...5678
```

Add to `.env`:
```env
VITE_INET_TOKEN_PACKAGE=0x1234...5678
VITE_PAYMENT_PACKAGE=0xabcd...ef01
VITE_VOUCHER_PACKAGE=0x9876...5432
```

## Contract Addresses (Testnet)

**Note**: These will be populated after deployment.

- INET Token: `[TO BE DEPLOYED]`
- Payment Escrow: `[TO BE DEPLOYED]`
- Voucher NFT: `[TO BE DEPLOYED]`

## Dependencies

All packages depend on the OneChain framework:
```toml
[dependencies]
One = { git = "https://github.com/one-chain-labs/onechain.git", subdir = "crates/one-framework/packages/one-framework", rev = "framework/mainnet" }
```

## Move.toml Configuration

Each package has a `Move.toml` file with:
- Package name and version
- OneChain framework dependency
- Address declarations

## Security Considerations

1. **Treasury Cap**: INET token minting requires treasury capability
2. **Admin Functions**: Payment completion should be restricted in production
3. **Voucher Activation**: Check voucher isn't already active
4. **Input Validation**: Validate plan IDs and codes
5. **Event Emission**: All state changes emit events for tracking

## Upgrade Strategy

Move contracts are **immutable** by default on OneChain. To upgrade:
1. Deploy new package version
2. Update frontend with new Package IDs
3. Migrate state if needed
4. Consider using upgrade patterns from Move docs

## Resources

- **Move Language**: https://move-language.github.io/move/
- **OneChain Docs**: https://docs.onelabs.cc
- **Sui Move Book**: https://docs.sui.io/guides/developer/first-app
- **Move Patterns**: https://docs.sui.io/guides/developer/app-examples

## Support

For contract-related questions:
- OneChain Discord: [Link if available]
- GitHub Issues: Create issue in main repo
- Move Community: https://discord.gg/move
