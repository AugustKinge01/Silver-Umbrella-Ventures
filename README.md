# Silver Umbrella Ventures (SUV) - Scaffold Stellar Edition

## 🏆 Scaffold Stellar Open Innovation Hackathon
**Track:** DePIN & IoT  
**Built with:** [Scaffold Stellar Framework](https://scaffoldstellar.org)

> ✅ **Hackathon Compliant:** This project uses the official Scaffold Stellar CLI for smart contract deployment and management

---

## 🌍 Problem: 600M Africans lack reliable internet/power

Rural communities face high connectivity costs, unreliable infrastructure, and no incentive for community ownership.

## 💡 Solution: Solar-Powered DePIN on Stellar

SUV enables communities to deploy solar WiFi hotspots, earn INET/NRGY tokens, and trade bandwidth using Stellar smart contracts.

---

## 🚀 Scaffold Stellar Integration (Meets All Hackathon Requirements)

### ✅ 1. Deployed Smart Contracts (Rust → Wasm)

#### Payment Contract (`contracts/payment/`)
- **Escrow for plan purchases** with XLM/tokens
- **Why Stellar:** <$0.00001 fees vs 2-5% card fees saves ₦50-250 per transaction
- **Functions:** `create_payment()`, `complete_payment()`, `refund_payment()`

#### INET Token (`contracts/inet-token/`)
- **Stellar Asset Contract** for internet bandwidth credits
- **Why Stellar:** Enables pay-per-MB pricing (₦0.01/token vs ₦50 card minimum)
- **Functions:** `mint()`, `burn()`, `transfer()`, `balance()`

#### Voucher Contract (`contracts/voucher/`)
- **NFT vouchers** for plan access with fraud prevention
- **Functions:** `mint_voucher()`, `activate_voucher()`, `transfer()`

### ✅ 2. Functional Frontend (React + Vite + TypeScript)

- Modern React UI generated from Scaffold Stellar template
- AI-powered bandwidth optimization (Lovable AI)
- Real-time equipment health monitoring
- Mobile-first responsive design

### ✅ 3. Stellar Wallet Kit Integration

**Component:** `src/components/StellarWalletButton.tsx`  
**Wallet:** Freighter integration for:
- Account connection
- Transaction signing
- Balance display (XLM + tokens)

---

## 📐 Architecture

```
SUV Frontend (React/Vite)
    ↓
Stellar Wallet Kit (Freighter)
    ↓
TypeScript Clients (Auto-generated)
    ↓
Stellar Smart Contracts (Rust/Wasm)
    ↓
Stellar Testnet → Horizon API → Mirror Nodes
```

---

## 🛠️ Setup & Deployment (Scaffold Stellar)

### Prerequisites
```bash
# 1. Install Rust and Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# 2. Install Stellar CLI
cargo install --locked stellar-cli --features opt

# 3. Install Scaffold Stellar CLI (REQUIRED for hackathon)
cargo install --locked stellar-scaffold-cli

# 4. Install Node.js dependencies
npm install

# 5. Configure Stellar testnet
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# 6. Create and fund admin account
stellar keys generate --global admin --network testnet
curl "https://friendbot.stellar.org?addr=$(stellar keys address admin)"
```

### Quick Start with Scaffold Stellar

#### Option A: Deploy Contracts (Automated)
```bash
# Deploy using Scaffold Stellar registry
chmod +x scripts/deploy-contracts.sh
./scripts/deploy-contracts.sh
```

This automatically:
- Builds all contracts using Scaffold Stellar
- Publishes to Stellar registry with `stellar registry publish`
- Deploys contract instances with `stellar registry deploy`
- Generates TypeScript bindings
- Creates `.env.local` with contract addresses

#### Option B: Development Mode with Watch
```bash
# Start Scaffold Stellar watch mode (auto-rebuild on changes)
stellar scaffold watch --build-clients

# In another terminal, run the frontend
npm run dev  # Runs on localhost:5173
```

### Manual Deployment with Scaffold Stellar
See detailed instructions in [`contracts/README.md`](./contracts/README.md)

### Verify Scaffold Stellar Installation
```bash
# Check if Scaffold Stellar CLI is installed
stellar scaffold --version

# View available Scaffold Stellar commands
stellar scaffold --help
stellar registry --help
```

---

## 💰 Market & Revenue

- **TAM:** 80M Nigerians × ₦5K/month = ₦400B/year
- **Revenue:** Plan sales (₦500-5K), 1% token transfer fees, equipment leasing

---

## 🏆 Traction

- ✅ 3 deployed Stellar contracts on Testnet
- ✅ Functional payment flow with Freighter wallet
- ✅ AI bandwidth optimization + real-time monitoring
- **Roadmap:** 5 pilot hotspots in Ekiti State → 10K users by Month 12

---

## 👤 Team

**Victor Olumese** - Fullstack Developer, Web3 Enthusiast  
**Contact:** support@silverumbrella.ventures

---

## 📎 Resources

- **Demo Video:** [3-min live Stellar transaction on Testnet]
- **Pitch Deck:** [Link]
- **Website:** https://suv.lovable.app

**Built with Scaffold Stellar 🚀**
