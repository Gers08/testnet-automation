# Pharos Testnet Automation

Automate common blockchain actions on the Pharos Testnet, including:

- Swapping between different Pharos tokens
- Transferring Pharos Token
- Deploying smart contracts
- Deploying ERC20 tokens
- Deploying NFTs (ERC721)

All tasks can run automatically with configurable frequencies and weights.

---

## Features

- **Automated Swaps:** Swap tokens, maintaining liquidity pool ratios.
- **Token Transfers:** Send tokens between addresses.
- **Smart Contract Deployment:** Deploy contracts on the Pharos testnet.
- **ERC20 Token Deployment:** Deploy custom ERC20 tokens.
- **NFT Deployment:** Deploy ERC721 NFT contracts.
- **Automatic Approvals:** Approve token spending as needed.
- **Robust Error Handling:** Automatic retries and error logging.
- **Liquidity Management:** Prevent pool depletion by managing swap sizes.

---

## Prerequisites

- Node.js v16 or higher
- npm
- Access to a Pharos Testnet RPC endpoint
- A funded testnet wallet (PHRS, USDC, USDT, or other Pharos token)

---

## Installation & Setup

### 1. Clone the Repository and Install Dependencies

```bash
git clone https://github.com/Gers08/testnet-automation.git
cd testnet-automation
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with your wallet details:

```env
USER_ADDRESS=your-wallet-address
PRIVATE_KEY=your-wallet-private-key
```

### 3. Configure Automation Behavior

Edit `src/constant/config.js` to set action weights and liquidity parameters:

```js
ACTION_WEIGHTS: {
    Swap: 82,            // 82% chance to swap
    TransferToken: 15,   // 15% chance to transfer
    DeployToken: 1,      // 1% chance to deploy ERC20
    DeployNFT: 1,        // 1% chance to deploy NFT
    DeployContract: 1,   // 1% chance to deploy contract
},

AMOUNT_OF_LIQUIDITY: 200, // Amount of liquidity to add to the pool (for both tokens)
SWAP_MIN_AMOUNT: 1,       // Minimum token amount to swap
SWAP_MAX_AMOUNT: 10,      // Maximum token amount to swap
```

### 4. Deploy Tokens to Swap

Update the token addresses in `src/constant/addresses.js` to your own deployed token addresses:

```js
ASSET_ONE: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED",
ASSET_TWO: "0xD4071393f8716661958F766DF660033b3d35fD29"
```

Get the address of the token from the official Pharos Docs: [https://docs.pharosnetwork.xyz/network-overview/pharos-networks/pharos-testnet-information]

### 5. Deploy the Liquidity Pool

Deploy the pool contract using:

```bash
npm run deploy-pool
```

After deployment, update the UniswapPool address in `src/constant/addresses.js`.

### 6. Add Liquidity to the Pool

Add liquidity to the pool with:

```bash
npm run add-liquidity-pool
```

### 7. Configure Transfer Recipients

Add recipient addresses for token transfers in `src/constant/addresses.js`:

```js
TRANSFER_RECIPIENTS: [
    "0xRecipientAddress1",
    // Add more addresses as needed
],
```

### 8. Start the Automation Script

Begin automated actions with:

```bash
npm run automate-pharos
```

---

## Notes

- Ensure your wallet has enough testnet funds for gas and operations.
- Keep your `.env` file secure and **never** commit it to version control.
- This tool is designed for the Pharos testnet only—**do not** use mainnet keys or endpoints.

---

## 🤝 Contributing

Want to improve this tool or add new actions?  
Pull requests and issues are welcome!

---

## 📄 License

MIT License © 2025 Gers08