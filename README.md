# Xpay - Stellar Payments & Content Protection Platform

[![Stellar](https://img.shields.io/badge/Powered%20by-Stellar-blue.svg)](https://stellar.org)
[![X402 Protocol](https://img.shields.io/badge/X402-Protocol-purple.svg)](https://httpwg.org/http-extensions/draft-ietf-httpbis-retry-03.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

Xpay is a comprehensive payment platform that combines peer-to-peer XLM transfers with X402 content protection. Send and receive Stellar Lumens globally in seconds, while monetizing premium content through automated payment gates.

## 🌟 Features

### 💸 P2P Payments
- **Lightning Fast**: Send and receive XLM in 3-5 seconds globally
- **Minimal Fees**: Base fee of 0.00001 XLM per transaction
- **QR Code Support**: Generate QR codes instantly for seamless payments
- **Global Network**: Access 180+ countries with Stellar's distributed ledger

### 🔒 X402 Content Protection
- **Monetize Content**: Protect APIs, articles, and premium content automatically
- **HTTP 402 Protocol**: Server responds with "Payment Required" for protected resources
- **Auto Unlock**: Content unlocks immediately after payment proof verification
- **Blockchain Security**: Stellar blockchain ensures payment authenticity

### 📊 Dashboard & Analytics
- **Real-time Insights**: AI-powered analytics for payment patterns
- **Profile Management**: Complete user profile with avatar, banner, and bio
- **Payment History**: Track all transactions and payment requests
- **Active Payments**: Monitor pending payment requests with shareable links

## 🏗️ Architecture</search></search></search>
</search_and_replace>

## 🏗️ Architecture

### Backend
- **Framework**: Elysia.js (Bun runtime)
- **Database**: MongoDB with Mongoose ODM
- **Blockchain**: Stellar SDK integration
- **AI Analytics**: Cerebras Cloud SDK for insights
- **CORS**: Configured for frontend-backend communication

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom gradients
- **Wallet Integration**: Stellar Wallets Kit
- **State Management**: React Query for API state
- **Routing**: React Router DOM v7

### Smart Contracts
- **Paywall Contract**: Soroban smart contract for content protection
- **Fungible Token**: Custom token support
- **NFT Support**: Non-fungible token integration

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ or **Bun**: v1.0+
- **MongoDB**: v7.0+
- **Stellar Account**: Testnet or Mainnet wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/stelpay.git
   cd stelpay
   ```

2. **Backend Setup**
   ```bash
   cd backend
   bun install
   cp .env.example .env  # Configure environment variables
   bun run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env  # Configure environment variables
   npm run dev
   ```

4. **Contracts Setup** (Optional)
   ```bash
   cd frontend
   npm run install:contracts
   ```

### Environment Configuration

#### Backend (.env)
```env
PORT=4000
DB_NAME=stellapay
MONGODB_URI=mongodb://localhost:27017
ALLOW_ORIGIN=https://xpay.coin0.xyz
CEREBRAS_API_KEY=your_cerebras_api_key
```

#### Frontend (.env)
```env
# Stellar Network Configuration
STELLAR_SCAFFOLD_ENV=development
PUBLIC_STELLAR_NETWORK="LOCAL"
PUBLIC_STELLAR_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
PUBLIC_STELLAR_RPC_URL="http://localhost:8000/rpc"
PUBLIC_STELLAR_HORIZON_URL="http://localhost:8000"

# For Testnet
# PUBLIC_STELLAR_NETWORK="TESTNET"
# PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
# PUBLIC_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
# PUBLIC_STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"

# For Mainnet
# PUBLIC_STELLAR_NETWORK="MAINNET"
# PUBLIC_STELLAR_NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"
# PUBLIC_STELLAR_RPC_URL="https://soroban.stellar.org"
# PUBLIC_STELLAR_HORIZON_URL="https://horizon.stellar.org"
```

## 📱 Application Routes

### Public Routes
- `/` - Landing page with feature overview
- `/send-payment` - Send XLM to any Stellar address
- `/generate-payment` - Create payment requests with QR codes
- `/pay/:paymentRequestId` - Public payment page for requests
- `/post/:postId` - Protected content viewing (X402)

### Protected Routes (Require Wallet)
- `/x402-protection` - Create protected content/posts
- `/dashboard` - User dashboard with analytics

## 🔧 API Endpoints

### User Management
- `POST /api/v1/create-user` - Create new user
- `PUT /api/v1/update-user` - Update user profile
- `POST /api/v1/profile` - Get user profile

### Payment Operations
- `POST /api/v1/create-payment` - Record completed payment
- `POST /api/v1/payments-by-user` - Get user payment history
- `PUT /api/v1/update-payment-status` - Update payment status

### Payment Requests
- `POST /api/v1/create-payment-request` - Create payment request
- `GET /api/v1/payment-request/:id` - Get payment request details
- `POST /api/v1/complete-payment-request` - Complete payment request

### Content Protection
- `POST /api/v1/create-post` - Create protected content
- `GET /api/v1/post/:id` - Access protected content
- `POST /api/v1/complete-post-payment` - Complete content payment

### Analytics
- `POST /api/v1/analytics` - Get AI-powered insights

## 🛠️ Development

### Available Scripts

#### Backend
```bash
bun run dev          # Start development server with hot reload
bun run test         # Run tests (when implemented)
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure
```
xpay/
├── backend/                 # Elysia.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── hooks/         # Custom React hooks
│   │   └── providers/     # Context providers
│   ├── contracts/         # Soroban smart contracts
│   └── package.json
└── README.md
```

## 🔐 Security Features

- **Wallet Authentication**: Secure Stellar wallet integration
- **Blockchain Verification**: All payments verified on Stellar network
- **CORS Protection**: Configured cross-origin policies
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Built-in request throttling (future)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the Stellar network
- **Soroban** for smart contract platform
- **Elysia.js** for the amazing Bun-based framework
- **React** ecosystem for frontend development

## 📞 Support

For support, email support@xpay.com or join our Discord community.

---

**Built with ❤️ using Stellar, React, and modern web technologies**