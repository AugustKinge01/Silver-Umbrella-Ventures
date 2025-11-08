# Silver Umbrella Ventures - Stellar Smart Contracts

This directory contains the Soroban smart contracts for the SUV platform.

## Contracts

1. **INET Token** (`inet-token/`) - Bandwidth credit token on Stellar
2. **Payment Contract** (`payment/`) - Escrow contract for plan purchases
3. **Voucher Contract** (`voucher/`) - NFT-style vouchers for internet/power access

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Configure testnet
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

## Build Contracts

```bash
# Build all contracts
cd contracts/inet-token && stellar contract build
cd ../payment && stellar contract build
cd ../voucher && stellar contract build
```

## Deploy to Testnet

### 1. Create Test Identity
```bash
stellar keys generate --global admin --network testnet
stellar keys address admin

# Fund your account
curl "https://friendbot.stellar.org?addr=$(stellar keys address admin)"
```

### 2. Deploy Contracts

```bash
# Deploy INET Token
cd inet-token
INET_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/inet_token.wasm \
  --source admin \
  --network testnet)
echo "INET Token ID: $INET_ID"

# Deploy Payment Contract
cd ../payment
PAYMENT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --source admin \
  --network testnet)
echo "Payment Contract ID: $PAYMENT_ID"

# Deploy Voucher Contract
cd ../voucher
VOUCHER_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/voucher_contract.wasm \
  --source admin \
  --network testnet)
echo "Voucher Contract ID: $VOUCHER_ID"
```

### 3. Initialize Contracts

```bash
# Initialize INET Token
stellar contract invoke \
  --id $INET_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $(stellar keys address admin) \
  --decimal 7 \
  --name "Internet Token" \
  --symbol "INET"

# Initialize Payment Contract
stellar contract invoke \
  --id $PAYMENT_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $(stellar keys address admin)

# Initialize Voucher Contract
stellar contract invoke \
  --id $VOUCHER_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $(stellar keys address admin)
```

### 4. Update Environment Variables

Add the deployed contract IDs to your `.env.local` file:

```bash
VITE_STELLAR_INET_TOKEN_ID=$INET_ID
VITE_STELLAR_PAYMENT_CONTRACT_ID=$PAYMENT_ID
VITE_STELLAR_VOUCHER_CONTRACT_ID=$VOUCHER_ID
VITE_STELLAR_ADMIN_ADDRESS=$(stellar keys address admin)
```

## Generate TypeScript Bindings

```bash
# Generate TypeScript clients for frontend
stellar contract bindings typescript \
  --network testnet \
  --contract-id $INET_ID \
  --output-dir ../src/contracts/inet-token

stellar contract bindings typescript \
  --network testnet \
  --contract-id $PAYMENT_ID \
  --output-dir ../src/contracts/payment

stellar contract bindings typescript \
  --network testnet \
  --contract-id $VOUCHER_ID \
  --output-dir ../src/contracts/voucher
```

## Testing Contracts

```bash
# Run contract tests
cd inet-token && cargo test
cd ../payment && cargo test
cd ../voucher && cargo test
```

## Contract Interactions

### Mint INET Tokens
```bash
stellar contract invoke \
  --id $INET_ID \
  --source admin \
  --network testnet \
  -- \
  mint \
  --to USER_ADDRESS \
  --amount 1000000000
```

### Create Payment
```bash
stellar contract invoke \
  --id $PAYMENT_ID \
  --source user \
  --network testnet \
  -- \
  create_payment \
  --buyer USER_ADDRESS \
  --plan_id "basic_internet" \
  --amount 100000000 \
  --token_address $INET_ID
```

### Mint Voucher
```bash
stellar contract invoke \
  --id $VOUCHER_ID \
  --source admin \
  --network testnet \
  -- \
  mint_voucher \
  --admin ADMIN_ADDRESS \
  --owner USER_ADDRESS \
  --plan_id "basic_internet" \
  --code "VOUCHER123" \
  --duration_hours 720
```

## Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar CLI Reference](https://developers.stellar.org/docs/tools/stellar-cli)
- [Scaffold Stellar](https://scaffoldstellar.org)
