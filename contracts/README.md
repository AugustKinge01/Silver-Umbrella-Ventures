# Silver Umbrella Ventures - Scaffold Stellar Smart Contracts

This directory contains the Soroban smart contracts deployed using **Scaffold Stellar** for the SUV platform.

> 🏆 **Hackathon Compliant:** All contracts use the Scaffold Stellar CLI and registry system

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

# Install Scaffold Stellar CLI (REQUIRED)
cargo install --locked stellar-scaffold-cli

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

## Deploy to Testnet with Scaffold Stellar

### 1. Create Test Identity
```bash
stellar keys generate --global admin --network testnet
stellar keys address admin

# Fund your account
curl "https://friendbot.stellar.org?addr=$(stellar keys address admin)"
```

### 2. Publish & Deploy Contracts Using Scaffold Stellar

#### Method A: Automated Deployment Script (Recommended)
```bash
# Run the automated deployment script
cd ../..
chmod +x scripts/deploy-contracts.sh
./scripts/deploy-contracts.sh
```

#### Method B: Manual Deployment with Scaffold Stellar

```bash
# Publish INET Token to Stellar Registry
cd inet-token
stellar registry publish \
  --wasm target/wasm32-unknown-unknown/release/inet_token.wasm \
  --wasm-name suv-inet-token \
  --source admin \
  --network testnet

# Deploy INET Token instance
INET_ID=$(stellar registry deploy \
  --contract-name inet-token-instance \
  --wasm-name suv-inet-token \
  --source admin \
  --network testnet)
echo "INET Token ID: $INET_ID"

# Publish Payment Contract to Registry
cd ../payment
stellar registry publish \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --wasm-name suv-payment-contract \
  --source admin \
  --network testnet

# Deploy Payment Contract instance
PAYMENT_ID=$(stellar registry deploy \
  --contract-name payment-instance \
  --wasm-name suv-payment-contract \
  --source admin \
  --network testnet)
echo "Payment Contract ID: $PAYMENT_ID"

# Publish Voucher Contract to Registry
cd ../voucher
stellar registry publish \
  --wasm target/wasm32-unknown-unknown/release/voucher_contract.wasm \
  --wasm-name suv-voucher-contract \
  --source admin \
  --network testnet

# Deploy Voucher Contract instance
VOUCHER_ID=$(stellar registry deploy \
  --contract-name voucher-instance \
  --wasm-name suv-voucher-contract \
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

## Generate TypeScript Bindings with Scaffold Stellar

```bash
# Install deployed contracts locally
stellar registry install inet-token-instance
stellar registry install payment-instance
stellar registry install voucher-instance

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

## Scaffold Stellar Development Workflow

```bash
# Start watch mode (auto-rebuild on changes)
stellar scaffold watch --build-clients

# View published contracts in registry
stellar registry list

# Install a contract from registry
stellar registry install contract-name

# Upgrade a deployed contract
stellar registry deploy --contract-name instance-name --wasm-name new-wasm-name
```

## Resources

- [Scaffold Stellar Documentation](https://scaffoldstellar.org)
- [Scaffold Stellar GitHub](https://github.com/AhaLabs/scaffold-stellar)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar CLI Reference](https://developers.stellar.org/docs/tools/stellar-cli)
