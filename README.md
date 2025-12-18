# Silver Umbrella Ventures (SUV) - Hybrid Digital Ecosystem

## 🏆 OneHack Hackathon Submission
**Track:** DePIN & IoT / Web3 Ecosystem  
**Built with:** React, Vite, TypeScript, OneChain EVM, Supabase

---

## 🌍 The Problem
There are over 70 million people in rural and peri-urban communities in Nigeria facing the problem of poor access to:
- **Reliable internet connectivity** - expensive, unreliable infrastructure
- **Quality workspaces** - limited affordable coworking options
- **Gaming & entertainment** - no access to premium gaming experiences
- **Digital identity & rewards** - no incentives for community participation

## 💡 Our Solution: Work • Play • Earn

SUV is a hybrid digital ecosystem that combines physical spaces with blockchain-powered rewards:

### 📡 Internet & Hotspots
- **Solar-Powered WiFi:** Community hotspots with reliable connectivity
- **Flexible Plans:** Pay-per-use or subscription models
- **Voucher System:** Prepaid internet access tokens


### 🏢 Coworking Hub
- **4 Tier System:** Basic → Standard → Pro → VIP
- **Meal Benefits:** Higher tiers include daily meals (up to 2/day)
- **Flexible Booking:** Hourly, daily, or monthly passes
- **XP Rewards:** Earn points for every hour worked

### 🎮 Game Hub
- **Console Gaming:** PS4/PS5 stations
- **VR Experiences:** Racing simulators & immersive VR
- **Mobile Esports:** Competitive mobile gaming tournaments
- **Tournaments:** Regular competitions with crypto prizes


### 🏆 XP & Rewards System
- **Earn XP:** Every activity earns experience points
- **Level Up:** Progress through levels for perks
- **Leaderboards:** Compete with the community
- **Player DID:** On-chain decentralized identity

---

## 🔗 Blockchain Integration (OneChain EVM)

### Smart Contracts
- **INET Token:** Utility token for bandwidth credits
- **Payment Contract:** Escrow for secure crypto payments
- **Voucher Contract:** NFT-based access vouchers

### Wallet Integration
- **OneWallet:** Native EVM wallet for transactions
- **Crypto Payments:** Pay for all services with crypto
- **Low Fees:** < $0.01 transaction costs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| Blockchain | OneChain EVM, ethers.js v6, Solidity |
| State | React Query, React Context |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SUV Frontend                         │
│              (React + Vite + TypeScript)                │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌───────────┐ ┌─────────────────┐
│   Supabase      │ │ OneChain  │ │   Edge          │
│   (Database,    │ │ EVM       │ │   Functions     │
│    Auth, RLS)   │ │ (Wallet)  │ │   (AI, Logic)   │
└─────────────────┘ └───────────┘ └─────────────────┘
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📊 Database Schema

### Core Tables
- `profiles` - User profile information
- `user_roles` - Role-based access (admin, moderator, user)
- `user_xp` - XP balances and levels
- `xp_transactions` - XP earning history
- `player_did` - On-chain identity and achievements

### Coworking
- `coworking_tier_configs` - Tier pricing and benefits
- `coworking_spaces` - Available workspaces
- `coworking_bookings` - User reservations

### Gaming
- `gaming_stations` - Console/VR stations
- `gaming_sessions` - Active play sessions
- `tournaments` - Scheduled competitions
- `tournament_participants` - Registered players

### Payments & Support
- `payments` - Transaction history
- `support_tickets` - Customer support

---

## 💰 Revenue Model

1. **Internet Plans** - Connectivity subscriptions
2. **Gaming Sessions** - paid time slots 
3. **Other adjacent upsells** - printing, photocopying, snacks, etc.
4. **Coworking Subscriptions** - Tiered monthly plans
---

## 🎯 MVP Features
- [ ] Internet plan purchases
- [ ] Hotspot connectivity
- [ ] Voucher redemption
- [x] User authentication & profiles
- [x] XP system with levels & leaderboards
- [x] Coworking tier configurations
- [x] Gaming station management
- [x] Tournament system
- [x] Crypto wallet integration
- [x] Admin dashboard
---

## 👤 Team

**Gabriel Abayomi Areje** - Founder, Web3 Enthusiast  
**Contact:** lightfab1234@gmail.com

---

## 📎 Links

- **Live Demo:** https://suv.lovable.app
- **Documentation:** See `/docs` folder

**Built for OneHack 🚀**
