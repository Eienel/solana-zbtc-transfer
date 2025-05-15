# Solana zBTC Transfer App

A clean, responsive React application for transferring zBTC tokens on the Solana blockchain. This app allows users to connect their Solana wallets and send zBTC tokens from one address to another on Solana mainnet.

![Solana zBTC Transfer App](https://placeholder-for-app-screenshot.com/screenshot.png)

## Features

- Connect popular Solana wallets (Phantom, Solflare, etc.)
- View your wallet address, SOL balance, and zBTC token balance
- Send zBTC tokens to any valid Solana address
- Automatic creation of associated token accounts if needed
- Real-time transaction status updates
- Mobile-friendly responsive design

## Table of Contents

- [Solana zBTC Transfer App](#solana-zbtc-transfer-app)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Code Explanation](#code-explanation)
    - [App.jsx](#appjsx)
      - [Key Components:](#key-components)
      - [Notable Functions:](#notable-functions)
    - [App.css](#appcss)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Local Development](#local-development)
  - [Deployment](#deployment)
    - [Building for Production](#building-for-production)
    - [Deployment Options](#deployment-options)
      - [Vercel](#vercel)
      - [Netlify](#netlify)
      - [GitHub Pages](#github-pages)
  - [Security Considerations](#security-considerations)
  - [Troubleshooting](#troubleshooting)
    - [Wallet Connection Issues](#wallet-connection-issues)
    - [Transaction Failures](#transaction-failures)
    - [Token Display Issues](#token-display-issues)
  - [Technical Details](#technical-details)

## Technology Stack

- **React**: Frontend library for building the user interface
- **Solana Web3.js**: For blockchain interactions and transaction handling
- **SPL Token**: For token transfer operations and associated account management
- **CSS**: Custom styling for responsive design

## Project Structure

```
solana-zbtc-transfer/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Styling for the application
│   ├── index.js          # Entry point for React
│   └── index.css         # Base styling
├── package.json          # Project dependencies and scripts
└── README.md             # This documentation file
```

## Code Explanation

### App.jsx

The main application component handles wallet connection, balance fetching, and token transfers:

#### Key Components:

1. **State Management**
   - Manages wallet connection status, balances, and transaction details
   - Tracks user input for recipient address and transfer amount

2. **Wallet Connection**
   - Detects and connects to browser wallet extensions (Phantom, Solflare)
   - Handles wallet connection, disconnection, and auto-connection logic

3. **Balance Fetching**
   - Retrieves SOL balance using `connection.getBalance()`
   - Fetches zBTC token balance via `connection.getTokenAccountBalance()`
   - Handles cases where token accounts don't yet exist

4. **Token Transfer Logic**
   - Creates SPL token transfer transactions
   - Automatically creates associated token accounts if needed
   - Manages transaction signing and confirmation
   - Provides status updates throughout the transaction lifecycle

#### Notable Functions:

- `fetchBalances()`: Retrieves current SOL and zBTC balances
- `connectWallet()`: Handles wallet connection process
- `disconnectWallet()`: Manages wallet disconnection
- `handleTransfer()`: Processes the token transfer when form is submitted

### App.css

Contains all styling for the application:

- **Responsive Design**: Adapts to different screen sizes
- **Card-Based UI**: Clean, modern interface with card components
- **Color Variables**: Uses CSS variables for consistent theming
- **Form Styling**: User-friendly input fields and buttons
- **Status Messages**: Clearly presented transaction information

## Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Eienel/solana-zbtc-transfer.git
   cd solana-zbtc-transfer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To use the application:

1. **Connect Wallet**:
   - Click "Connect Wallet" button
   - Approve the connection request in your Solana wallet extension

2. **View Balances**:
   - Your wallet address will be displayed
   - SOL and zBTC balances will be shown if available

3. **Send zBTC**:
   - Enter the recipient's Solana address
   - Specify the amount of zBTC to send
   - Click "Send zBTC" button
   - Approve the transaction in your wallet

4. **Check Status**:
   - Transaction status updates will appear below the form
   - Balances will refresh after successful transactions

## Local Development

To run the app in development mode:

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

## Deployment

### Building for Production

Create an optimized production build:

```bash
npm run build
```

This generates a `build` directory with production-ready files.

### Deployment Options

#### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel login
   vercel
   ```

#### Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify login
   netlify deploy --prod
   ```

#### GitHub Pages

1. Update `package.json` with your repository URL:
   ```json
   "homepage": "https://yourusername.github.io/solana-zbtc-transfer"
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

## Security Considerations

- **Private Keys**: The app never accesses or stores private keys
- **Wallet Connection**: Uses standard wallet adapter protocol for secure connections
- **Transaction Verification**: Always verify details before approving transactions
- **Token Account Creation**: Handles token account creation securely

## Troubleshooting

### Wallet Connection Issues

- Ensure your wallet extension is installed and unlocked
- Verify your wallet is connected to Solana Mainnet
- Try refreshing the page if the wallet doesn't connect automatically

### Transaction Failures

- Check that you have sufficient SOL for transaction fees (typically 0.000005 SOL)
- Verify the recipient address is a valid Solana address
- Ensure you have sufficient zBTC balance for the transfer amount

### Token Display Issues

- If zBTC balance doesn't appear, you may not have an associated token account yet
- Try receiving a small amount of zBTC first to create the token account
- Refresh the page after receiving tokens to update balances

---

## Technical Details

- **Solana Network**: Mainnet
- **zBTC Token Address**: `zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg`
- **RPC Endpoint**: `https://api.mainnet-beta.solana.com`
