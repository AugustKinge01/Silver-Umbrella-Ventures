# Silver Umbrella Ventures - Scaffold Stellar Hackathon Submission

## 🏆 Scaffold Stellar Open Innovation Hackathon

**Project:** Silver Umbrella Ventures (SUV)  
**Track:** DePIN & IoT  
**Team:** Victor Olumese

---

## ✅ Hackathon Requirements Checklist

### 1. Built with Scaffold Stellar Framework ✓

- **Scaffold Stellar CLI installed and used:**
  ```bash
  cargo install --locked stellar-scaffold-cli
  stellar scaffold --version
  ```

- **Deployment uses Scaffold Stellar registry:**
  - All contracts published with `stellar registry publish`
  - All instances deployed with `stellar registry deploy`
  - See: `scripts/deploy-contracts.sh`

- **Registry Commands Used:**
  ```bash
  # Publish WASM to registry
  stellar registry publish --wasm contract.wasm --wasm-name suv-inet-token
  
  # Deploy contract instance
  stellar registry deploy --contract-name inet-token-instance --wasm-name suv-inet-token
  
  # Install for local development
  stellar registry install inet-token-instance
  ```

### 2. Deployed Smart Contracts (Rust → Wasm) ✓

#### INET Token Contract (`contracts/inet-token/`)
- **Purpose:** Bandwidth credit token on Stellar
- **Registry Name:** `suv-inet-token`
- **Instance:** `inet-token-instance`
- **Functions:** `initialize()`, `mint()`, `burn()`, `transfer()`, `balance()`

#### Payment Contract (`contracts/payment/`)
- **Purpose:** Escrow for plan purchases
- **Registry Name:** `suv-payment-contract`
- **Instance:** `payment-instance`
- **Functions:** `initialize()`, `create_payment()`, `complete_payment()`, `refund_payment()`

#### Voucher Contract (`contracts/voucher/`)
- **Purpose:** NFT-style vouchers for internet access
- **Registry Name:** `suv-voucher-contract`
- **Instance:** `voucher-instance`
- **Functions:** `initialize()`, `mint_voucher()`, `activate_voucher()`, `transfer()`, `is_valid()`

### 3. Functional Frontend (React + Vite + TypeScript) ✓

- **Framework:** React 18 + Vite + TypeScript
- **UI Library:** Tailwind CSS + Shadcn/ui
- **Wallet Integration:** Freighter via `@stellar/freighter-api`
- **Features:**
  - User Dashboard with real-time stats
  - Plan purchase flow with Stellar payments
  - Voucher management
  - AI-powered bandwidth optimization
  - Equipment health monitoring

### 4. Stellar Wallet Kit Integration ✓

- **Component:** `src/components/StellarWalletButton.tsx`
- **Context:** `src/contexts/StellarContext.tsx`
- **Wallet:** Freighter integration
- **Features:**
  - Connect/disconnect wallet
  - Display XLM and token balances
  - Sign transactions
  - Send payments

---

## 🌍 Problem & Solution

### Problem
600M Africans lack reliable internet/power due to:
- High connectivity costs (₦5K-10K/month)
- Unreliable infrastructure
- No community ownership incentive

### Solution
Solar-powered DePIN on Stellar enabling:
- Community-owned WiFi hotspots
- INET token rewards for bandwidth sharing
- Fractional micropayments (₦0.01/token vs ₦50 card minimum)
- <$0.00001 fees vs 2-5% card fees

---

## 🚀 Technical Architecture

```
SUV Frontend (React + Vite)
    ↓
Freighter Wallet (@stellar/freighter-api)
    ↓
TypeScript Contract Clients (auto-generated)
    ↓
Stellar Smart Contracts (Rust/Wasm)
    ↓
Scaffold Stellar Registry
    ↓
Stellar Testnet → Horizon API
```

---

## 📦 Deployment Instructions

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Install Scaffold Stellar CLI (REQUIRED)
cargo install --locked stellar-scaffold-cli

# Configure testnet
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Deploy with Scaffold Stellar
```bash
# 1. Create and fund admin account
stellar keys generate --global admin --network testnet
curl "https://friendbot.stellar.org?addr=$(stellar keys address admin)"

# 2. Deploy contracts using Scaffold Stellar
chmod +x scripts/deploy-contracts.sh
./scripts/deploy-contracts.sh

# 3. Start frontend
npm install
npm run dev
```

---

## 💡 Why Stellar + Scaffold Stellar?

### Business Impact
- **Cost Savings:** <$0.00001 tx fees vs 2-5% card fees = ₦50-250 saved per transaction
- **Micropayments:** Pay ₦0.01/token vs ₦50 card minimum
- **Speed:** 3-5 second settlement vs 24-48 hours for traditional payments

### Developer Experience (Scaffold Stellar)
- **Fast Setup:** `stellar scaffold init` generates full-stack dApp
- **Smart Registry:** Publish once, deploy many times, upgrade seamlessly
- **Auto TypeScript:** Contract bindings generated automatically
- **Watch Mode:** `stellar scaffold watch --build-clients` for live development

---

## 🏆 Innovation Highlights

1. **DePIN Model:** Community-owned solar WiFi infrastructure
2. **Stellar Native:** INET token using Stellar Asset Contract (SAC)
3. **Smart Escrow:** Secure payments with refund protection
4. **NFT Vouchers:** Fraud-proof access codes with expiry
5. **AI Optimization:** Bandwidth prediction using Lovable AI
6. **Mobile-First:** Designed for African rural communities

---

## 📊 Market Opportunity

- **TAM:** 80M Nigerians × ₦5K/month = ₦400B/year ($480M USD)
- **Revenue Streams:**
  - Plan sales (₦500-5K)
  - 1% token transfer fees
  - Equipment leasing
  - API access for developers

---

## 🛣️ Roadmap

### Phase 1 (Months 1-3)
- ✅ Scaffold Stellar integration complete
- ✅ 3 deployed contracts on Testnet
- ✅ Functional payment flow
- 🔄 5 pilot hotspots in Ekiti State

### Phase 2 (Months 4-6)
- 100 hotspots deployed
- 1,000 active users
- Mainnet deployment

### Phase 3 (Months 7-12)
- 500 hotspots
- 10K users
- Partner integrations (MTN, Airtel)

---

## 🔗 Links

- **Live Demo:** https://suv.lovable.app
- **GitHub:** https://github.com/[your-repo]
- **Demo Video:** [3-min Stellar transaction walkthrough]
- **Contract Addresses:** See `.env.local` after deployment

---

## 👤 Team

**Victor Olumese**  
Fullstack Developer, Web3 Enthusiast  
**Contact:** support@silverumbrella.ventures

---

## 📄 License

Apache 2.0 - See LICENSE file

---

**Built with Scaffold Stellar 🚀**

*Empowering African communities through decentralized internet infrastructure*
