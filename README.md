# Silver Umbrella Ventures (SUV) - Stellar Edition

## Scaffold Stellar Open Innovation Hackathon
**Track:** DePIN & IoT  
**Built with:** Scaffold Stellar Framework

---

## 🌍 Problem: 600M Africans lack reliable internet/power

Rural communities face high connectivity costs, unreliable infrastructure, and no incentive for community ownership.

## 💡 Solution: Solar-Powered DePIN on Stellar

SUV enables communities to deploy solar WiFi hotspots, earn INET/NRGY tokens, and trade bandwidth using Stellar smart contracts.

---

## 🚀 Stellar Integration (Meets All Hackathon Requirements)

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

## 🛠️ Setup & Deployment

### Build Contracts
```bash
cd contracts/payment && stellar contract build
cd contracts/inet-token && stellar contract build
cd contracts/voucher && stellar contract build
```

### Deploy to Testnet
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --source ADMIN_KEY --network testnet
```

### Run Frontend
```bash
npm install
npm run dev  # Runs on localhost:5173
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
