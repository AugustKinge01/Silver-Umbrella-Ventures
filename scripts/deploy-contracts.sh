#!/bin/bash

# Deploy Silver Umbrella Stellar Contracts to Testnet
# Usage: ./scripts/deploy-contracts.sh

set -e

echo "🚀 Deploying Silver Umbrella contracts to Stellar Testnet..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI not found. Please install it first:"
    echo "cargo install --locked stellar-cli --features opt"
    exit 1
fi

# Build contracts
echo -e "${YELLOW}📦 Building contracts...${NC}"
cd contracts/inet-token && stellar contract build
cd ../payment && stellar contract build
cd ../voucher && stellar contract build
cd ../..

# Deploy INET Token
echo -e "${YELLOW}🪙 Deploying INET Token...${NC}"
cd contracts/inet-token
INET_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/inet_token.wasm \
  --source admin \
  --network testnet)
echo -e "${GREEN}✅ INET Token deployed: $INET_ID${NC}"

# Deploy Payment Contract
echo -e "${YELLOW}💰 Deploying Payment Contract...${NC}"
cd ../payment
PAYMENT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --source admin \
  --network testnet)
echo -e "${GREEN}✅ Payment Contract deployed: $PAYMENT_ID${NC}"

# Deploy Voucher Contract
echo -e "${YELLOW}🎫 Deploying Voucher Contract...${NC}"
cd ../voucher
VOUCHER_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/voucher_contract.wasm \
  --source admin \
  --network testnet)
echo -e "${GREEN}✅ Voucher Contract deployed: $VOUCHER_ID${NC}"

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

# Generate TypeScript bindings
echo -e "${YELLOW}🔧 Generating TypeScript bindings...${NC}"
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
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Contract IDs:"
echo "  INET Token: $INET_ID"
echo "  Payment:    $PAYMENT_ID"
echo "  Voucher:    $VOUCHER_ID"
echo ""
echo "Next steps:"
echo "  1. Copy .env.local to your environment"
echo "  2. Import the generated TypeScript clients from src/contracts/"
echo "  3. Test the contracts with: npm run dev"
