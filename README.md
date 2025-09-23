# 🎰 Earn Alot Lottery Platform

A complete lottery platform built with TON blockchain integration, featuring a backend API, frontend for creating lottery pools, and an admin panel.

## 🏗️ Architecture Overview

```
earn-alot-backend/          # Backend API (Node.js + Express + MongoDB)
├── src/
│   ├── models/             # Data models
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   └── connections/        # Database connection
├── frontend/               # Lottery Pool Creator (React + TON Wallet)
└── admin-panel/            # Admin Dashboard (React + Vite)
```

## 🚀 Features

### Backend API
- **User Management**: Registration, authentication with JWT
- **Pool Management**: Create, read, update lottery pools
- **Ticket System**: Buy tickets and track participation
- **MongoDB Integration**: Native MongoDB driver with proper indexing
- **Authentication**: JWT-based middleware for protected routes

### Frontend (Lottery Pool Creator)
- **TON Wallet Integration**: Connect with TON Connect
- **Pool Creation**: Interactive form for lottery pool parameters
- **Smart Contract Integration**: Deploy lottery contracts
- **Responsive Design**: Modern UI with mobile optimization

### Admin Panel
- **Dashboard**: Statistics, charts, and recent activity
- **Pool Management**: View, update, and manage all lottery pools
- **User Management**: Monitor registered users and their activities
- **Real-time Data**: Live updates from the backend

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js**
- **TypeScript** for type safety
- **MongoDB** with native driver
- **JWT** for authentication
- **Winston** for logging

### Frontend
- **React 18** with **TypeScript**
- **TON Connect** for wallet integration
- **Vite** for fast development
- **Axios** for API communication

### Admin Panel
- **React 18** + **TypeScript**
- **React Router** for navigation
- **Recharts** for data visualization
- **Vite** for build tooling

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- TON wallet (Tonkeeper, MyTonWallet, etc.)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd earn-alot-backend
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
MONGO_URI=mongodb://localhost:27017/earn-alot
JWT_SECRET=your-secret-key
DB_NAME=earn-alot
PORT=5000

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Admin Panel Setup
```bash
cd admin-panel

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/earn-alot
JWT_SECRET=your-super-secret-jwt-key
DB_NAME=earn-alot
PORT=5000
LOG_LEVEL=info

# BSC Testnet Configuration for ERC20 Token Transfer
PRIVATE_KEY=your_bsc_testnet_private_key_without_0x_prefix
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

### Frontend
Update the manifest URL in `src/main.tsx`:
```typescript
const manifestUrl = 'https://your-domain.com/tonconnect-manifest.json';
```

## 📱 Usage

### Creating a Lottery Pool

1. **Connect Wallet**: Use the TON Connect button to connect your TON wallet
2. **Fill Form**: Configure pool parameters:
   - Ticket price
   - Maximum tickets
   - Duration
   - Reward distribution percentages
   - Decay factors
3. **Deploy**: Click "Create Lottery Pool" to deploy the smart contract
4. **Confirmation**: Pool is saved to the backend and displayed in the list

### Admin Panel

1. **Dashboard**: View platform statistics and charts
2. **Pool Management**: Monitor and update pool statuses
3. **User Management**: Track registered users and their activities

## 🔌 API Endpoints

### Public Routes
- `GET /api/pools` - Get all active pools
- `GET /api/pools/:poolId` - Get specific pool details

### Protected Routes (Admin)
- `POST /api/pools` - Create new pool
- `PUT /api/pools/:poolId` - Update pool status
- `POST /api/login` - User authentication
- `POST /api/buy-ticket` - Purchase lottery ticket
- `POST /api/claim-bnb-ticket` - Claim BNB ticket and transfer ERC20 tokens
- `GET /api/unique/user` - Get user's tickets

## 🎯 Smart Contract Integration

The platform integrates with TON blockchain smart contracts for:
- **Pool Creation**: Deploy lottery contracts with custom parameters
- **Ticket Purchasing**: Buy tickets using TON cryptocurrency
- **Reward Distribution**: Automated prize distribution
- **Pool Management**: Admin controls for pool lifecycle

## 📊 Database Schema

### Users Collection
```typescript
interface UserDoc {
  uniqueID: string;
  userName: string;
  walletAddress: string;
  telegramId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Pools Collection
```typescript
interface PoolDoc {
  poolId: string;
  contractAddress: string;
  adminAddress: string;
  adminPercentage: number;
  floorPercentage: number;
  bonusPercentage: number;
  bid: number;
  duration: number;
  maxTicket: number;
  status: 'active' | 'completed' | 'cancelled';
  // ... other fields
}
```

### Tickets Collection
```typescript
interface TicketDoc {
  ticketId: string;
  userId: string;
  walletAddress: string;
  lotteryNumbers: (number | string)[];
  // ... other fields
}
```

### BNB Tickets Collection (ERC20 Token Transfer)
```typescript
interface BnbTicketDoc {
  ticketId: string;
  userId: string;
  walletAddress: string;
  userName: string;
  telegramId: string;
  bonusAmountInUSD: number;
  bonusAmountInTON: number;
  gldAmount: number;
  rewardInTON: number;
  rewardInUSD: number;
  currentTonPrice: number;
  bnbAddress: string;
  tokenAddress: string; // ERC20 token contract address
  poolAmount: number;
  transactionHash?: string; // BSC transaction hash
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Deployment

### Backend
```bash
# Build the project
npm run build

# Start production server
npm start
```

### Frontend
```bash
# Build for production
npm run build

# Deploy the dist folder to your hosting service
```

### Admin Panel
```bash
# Build for production
npm run build

# Deploy the dist folder to your hosting service
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation and sanitization
- **CORS Protection**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting (can be added)
- **Environment Variables**: Secure configuration management

## 🧪 Testing

```bash
# Backend tests
npm test

# Frontend tests
cd frontend && npm test

# Admin panel tests
cd admin-panel && npm test
```

## 📈 Monitoring & Logging

- **Winston Logger**: Structured logging with different levels
- **Morgan**: HTTP request logging
- **Error Handling**: Comprehensive error management
- **Performance Monitoring**: Response time tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: More detailed reporting and insights
- **Mobile App**: Native mobile applications
- **Multi-chain Support**: Integration with other blockchains
- **Automated Testing**: Comprehensive test suite
- **CI/CD Pipeline**: Automated deployment workflows

---

**Note**: This is a development version. For production use, ensure proper security measures, testing, and deployment procedures are in place.
