#!/bin/bash

# Deploy Silver Umbrella Contracts using Scaffold Stellar
# Hackathon Requirement: Uses stellar registry commands
# Usage: ./scripts/deploy-contracts.sh

set -e

echo "🚀 Deploying Silver Umbrella contracts with Scaffold Stellar..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI not found. Please install it first:"
    echo "cargo install --locked stellar-cli --features opt"
    exit 1
fi

# Check if Scaffold Stellar CLI is installed
echo -e "${BLUE}📋 Checking Scaffold Stellar installation...${NC}"
if ! stellar scaffold --version &> /dev/null; then
    echo "❌ Scaffold Stellar CLI not found. Installing now..."
    cargo install --locked stellar-scaffold-cli
    echo -e "${GREEN}✅ Scaffold Stellar CLI installed${NC}"
else
    echo -e "${GREEN}✅ Scaffold Stellar CLI found${NC}"
fi

# Build contracts
echo -e "${YELLOW}📦 Building contracts...${NC}"
cd contracts/inet-token && stellar contract build
cd ../payment && stellar contract build
cd ../voucher && stellar contract build
cd ../..

# Deploy using Scaffold Stellar Registry
echo -e "${BLUE}📦 Publishing contracts to Stellar Registry...${NC}"

# Publish INET Token to Registry
echo -e "${YELLOW}🪙 Publishing INET Token to registry...${NC}"
cd contracts/inet-token
stellar registry publish \
  --wasm target/wasm32-unknown-unknown/release/inet_token.wasm \
  --wasm-name suv-inet-token \
  --source admin \
  --network testnet
echo -e "${GREEN}✅ INET Token published to registry${NC}"

# Deploy INET Token instance
echo -e "${YELLOW}🪙 Deploying INET Token instance...${NC}"
INET_ID=$(stellar registry deploy \
  --contract-name inet-token-instance \
  --wasm-name suv-inet-token \
  --source admin \
  --network testnet)
echo -e "${GREEN}✅ INET Token instance deployed: $INET_ID${NC}"

# Publish Payment Contract to Registry
echo -e "${YELLOW}💰 Publishing Payment Contract to registry...${NC}"
cd ../payment
stellar registry publish \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --wasm-name suv-payment-contract \
  --source admin \
  --network testnet
echo -e "${GREEN}✅ Payment Contract published to registry${NC}"

# Deploy Payment Contract instance
echo -e "${YELLOW}💰 Deploying Payment Contract instance...${NC}"
PAYMENT_ID=$(stellar registry deploy \
  --contract-name payment-instance \
  --wasm-name suv-payment-contract \
  --source admin \
  --network testnet)
echo -e "${GREEN}✅ Payment Contract instance deployed: $PAYMENT_ID${NC}"

# Publish Voucher Contract to Registry
echo -e "${YELLOW}🎫 Publishing Voucher Contract to registry...${NC}"
cd ../voucher
stellar registry publish \
  --wasm target/wasm32-unknown-unknown/release/voucher_contract.wasm \
  --wasm-name suv-voucher-contract \
  --source admin \
  --network testnet
echo -e "${GREEN}✅ Voucher Contract published to registry${NC}"

# Deploy Voucher Contract instance
echo -e "${YELLOW}🎫 Deploying Voucher Contract instance...${NC}"
VOUCHER_ID=$(stellar registry deploy \
  --contract-name voucher-instance \
  --wasm-name suv-voucher-contract \
  --source admin \
  --network testnet)
echo -e "${GREEN}✅ Voucher Contract instance deployed: $VOUCHER_ID${NC}"

cd ../..

# Initialize contracts
echo -e "${YELLOW}⚙️  Initializing contracts...${NC}"
ADMIN_ADDRESS=$(stellar keys address admin)

stellar contract invoke \
  --id $INET_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS \
  --decimal 7 \
  --name "Internet Token" \
  --symbol "INET"

stellar contract invoke \
  --id $PAYMENT_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS

stellar contract invoke \
  --id $VOUCHER_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS

echo -e "${GREEN}✅ All contracts initialized${NC}"

# Create .env.local file
echo -e "${YELLOW}📝 Creating .env.local file...${NC}"
cat > .env.local << EOF
# Stellar Contract Addresses (Testnet)
VITE_STELLAR_INET_TOKEN_ID=$INET_ID
VITE_STELLAR_PAYMENT_CONTRACT_ID=$PAYMENT_ID
VITE_STELLAR_VOUCHER_CONTRACT_ID=$VOUCHER_ID
VITE_STELLAR_ADMIN_ADDRESS=$ADMIN_ADDRESS
VITE_STELLAR_NETWORK=testnet
EOF

echo -e "${GREEN}✅ Environment variables saved to .env.local${NC}"

# Install deployed contracts locally for TypeScript client generation
echo -e "${YELLOW}📥 Installing contracts locally...${NC}"
stellar registry install inet-token-instance
stellar registry install payment-instance
stellar registry install voucher-instance
echo -e "${GREEN}✅ Contracts installed locally${NC}"

# Generate TypeScript bindings using Scaffold Stellar
echo -e "${YELLOW}🔧 Generating TypeScript bindings with Scaffold Stellar...${NC}"
mkdir -p src/contracts

stellar contract bindings typescript \
  --network testnet \
  --contract-id $INET_ID \
  --output-dir src/contracts/inet-token

stellar contract bindings typescript \
  --network testnet \
  --contract-id $PAYMENT_ID \
  --output-dir src/contracts/payment

stellar contract bindings typescript \
  --network testnet \
  --contract-id $VOUCHER_ID \
  --output-dir src/contracts/voucher

echo -e "${GREEN}✅ TypeScript bindings generated${NC}"

echo ""
echo -e "${GREEN}🎉 Scaffold Stellar deployment complete!${NC}"
echo ""
echo -e "${BLUE}📋 Deployed Contract Instances:${NC}"
echo "  INET Token:  $INET_ID"
echo "  Payment:     $PAYMENT_ID"
echo "  Voucher:     $VOUCHER_ID"
echo ""
echo -e "${BLUE}📦 Published to Stellar Registry:${NC}"
echo "  suv-inet-token (WASM)"
echo "  suv-payment-contract (WASM)"
echo "  suv-voucher-contract (WASM)"
echo ""
echo -e "${GREEN}✅ Hackathon Requirements Met:${NC}"
echo "  ✓ Scaffold Stellar CLI used"
echo "  ✓ stellar registry publish commands"
echo "  ✓ stellar registry deploy commands"
echo "  ✓ Contracts published to registry"
echo "  ✓ TypeScript bindings generated"
echo ""
echo "Next steps:"
echo "  1. Start development: npm run dev"
echo "  2. Use watch mode: stellar scaffold watch --build-clients"
echo "  3. View contracts: stellar registry list"
