# 🌙 Moonbag

> Never miss out on long-term gains again. Moonbag Agent automatically maintains strategic positions in tokens you trade.

![Moonbag Agent](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2232&h=400)

## 🚀 What is Moonbag?

Moonbag is an innovative DeFi tool that automatically maintains strategic positions in tokens you trade. When you sell a token, instead of completely exiting your position, Moonbag creates a "moonbag" - a small position that could potentially yield significant returns if the token price increases substantially.

Built during Unfold '24, Moonbag aims to help traders maintain strategic positions in promising tokens without manual intervention.

## 🎯 Key Features

- **🤖 Automated Moonbag Creation**: When you sell a token, Moonbag Agent automatically maintains a strategic position
- **📊 Smart Position Sizing**: Configurable percentage-based position sizing for each moonbag (default 10%)
- **🐋 Whale Intelligence**: Analysis of whale wallet behaviors to validate moonbag opportunities
- **📈 Real-time Portfolio Tracking**: Monitor your moonbag performance with detailed analytics
- **🔒 Secure Architecture**: Non-custodial design with user-controlled AI agent wallets

## 🛠️ Technical Architecture

### Backend Stack

- **Framework**: Node.js + Express
- **Database**: PostgreSQL with Supabase
- **Blockchain Interaction**: ethers.js, 0x Protocol
- **Network**: Base Sepolia Testnet
- **Transaction Tracking**: Moralis Streams
- **API Documentation**: OpenAPI/Swagger
- **WebSocket Support**: Real-time updates

### Frontend Stack

- **Framework**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Web3**: wagmi + ConnectKit
- **Charts**: Recharts
- **Animations**: Framer Motion

## 🔗 Integrations

### 0x Protocol

- Automated token swaps
- Best price routing
- Gas optimization
- Liquidity aggregation

### Moralis Streams

- Real-time transaction monitoring
- ERC20 transfer tracking
- Webhook integration

### Base Sepolia

- Test network for development
- Chain ID: 84532
- WETH contract integration

## ⚙️ Environment Setup

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
WEBSOCKET_PORT=4000
WEBHOOK_URL=your_webhook_url

# Blockchain Configuration
RPC_URL=your_base_sepolia_rpc_url
CHAIN_ID=84532
WETH_ADDRESS=your_weth_contract_address

# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# API Keys
MORALIS_API_KEY=your_moralis_api_key
MORALIS_STREAM_ID=your_moralis_stream_id
ZERO_EX_API_KEY=your_0x_api_key

# Security
ENCRYPTION_KEY=your_encryption_key
```

## 📝 API Documentation

The API documentation is available in OpenAPI/Swagger format. To view the documentation:

1. Start the server
2. Visit `/api-docs` endpoint
3. Explore available endpoints and their specifications

## 🚀 Installation

### Prerequisites

- Node.js v16+
- PostgreSQL
- Supabase account
- Moralis account
- 0x API key
- Base Sepolia RPC endpoint

### Backend Setup

1. Clone and install dependencies:

```bash
git clone https://github.com/aZrael936/MoonBag.git
cd moonbag
npm install
```

2. Set up your environment variables as shown above

3. Create Moralis stream:

```bash
curl -X POST \
  'https://api.moralis.io/streams/v2' \
  -H 'accept: application/json' \
  -H 'X-API-Key: YOUR_MORALIS_API_KEY' \
  -d '{
    "webhook_url": "your_webhook_url/api/wallets/webhook",
    "description": "Moonbag transaction tracking",
    "tag": "moonbag",
    "chains": ["base-sepolia"],
    "events": [{"topic": "erc20"}]
  }'
```

4. Get 0x API key:

   - Visit [0x API Portal](https://dashboard.0x.org/)
   - Create an account and generate API key
   - Add key to your `.env` file

5. Start the server:

```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd moonbagfe
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

4. Start the development server:

```bash
npm run dev
```

## 🔄 Token Swap Process

1. **Transaction Detection**:

   - Moralis Stream detects ERC20 transfers
   - Webhook receives transaction data

2. **Swap Execution**:

   - System calculates moonbag percentage
   - Queries 0x API for best swap route
   - Executes swap via 0x Protocol
   - Records transaction in database

3. **Real-time Updates**:
   - WebSocket broadcasts transaction status
   - Frontend updates portfolio view

## 🔐 Security Features

- **🔑 Private Key Management**: Private keys are encrypted before storage
- **✍️ Transaction Signing**: All transactions require explicit user approval
- **👤 Non-custodial Design**: Users maintain full control of their funds
- **🔍 Smart Contract Auditing**: Regular security audits (coming soon)

## 🔧 Troubleshooting

### Common Issues

1. **0x API Issues**:

   - Verify API key is valid
   - Check token pair has liquidity
   - Ensure sufficient gas for swaps

2. **Moralis Stream Issues**:

   - Verify webhook URL is accessible
   - Check stream configuration
   - Monitor webhook logs

3. **Base Sepolia Issues**:
   - Ensure RPC endpoint is responsive
   - Verify WETH contract address
   - Check wallet has test ETH

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built during Unfold '24
- Special thanks to the Base ecosystem
- Inspired by DeFi traders worldwide

---

<p align="center">Made with ❤️ by the Moonbag Team</p>
