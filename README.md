# Pharos Testnet Automation

Automate common blockchain actions on the Pharos Testnet, including:

- Swap between USDC and USDT tokens (both directions)
- Transfer tokens
- Deploy smart contracts
- Deploy ERC20 tokens
- Deploy NFTs (ERC721)

Run all tasks automatically with configurable frequencies and weights.

---

## Features

- **Swap USDC ↔ USDT:** Automated token swaps maintaining liquidity pool ratios.
- **Token Transfers:** Send tokens between addresses.
- **Contract Deployment:** Deploy smart contracts on Pharos testnet.
- **Token Deployment:** Deploy custom ERC20 tokens.
- **NFT Deployment:** Deploy ERC721 NFT contracts.
- **Automatic approvals:** Approve token spending as needed.
- **Error handling:** Robust error catching and retries.
- **Liquidity management:** Prevent pool depletion by managing swap sizes.

---

## Prerequisites

- Node.js v16+
- npm
- Access to Pharos Testnet RPC endpoint
- A funded testnet wallet (PHRS, USDT, USDC)

---

## Installation & Setup

### 1. Clone this repository and install dependencies

```bash
git clone https://github.com/Gers08/testnet-automation.git
cd testnet-automation
npm install
```

### 2. Create a `.env` file in the root of your project with the following variables:

```env
USER_ADDRESS=your-wallet-address
PRIVATE_KEY=your-wallet-private-key
```

### 3. Configure the automation behavior in src/constant/config.js:

```js
ACTION_WEIGHTS: {
    Swap: 82,            // relative weight for Swap (82%)
    TransferToken: 15,   // 15%
    DeployToken: 1,      // 1%
    DeployNFT: 1,        // 1%
    DeployContract: 1,   // 1%
},

AMOUNT_OF_LIQIUDITY: 200, // amount of liquidity to add to the pool (both USDT and USDC)
    SWAP_MIN_AMOUNT: 1,    // minimum token amount to swap
    SWAP_MAX_AMOUNT: 10,   // maximum token amount to swap
```

### 4. Add Liquidity Pool Addresses in `src/constant/addresses.js`:

```bash
npm run add-liquidity-pool
```

### 5. Add transfer recipient addresses in `src/constant/addresses.js`:

```js
TRANSFER_RECIPIENTS: [
    "",
    // add more addresses as needed
],
```

### 6. Start the automation script:

```bash
npm run automate-pharos
```

---

## Notes

- Ensure your wallet has enough testnet funds (PHRS, USDC, USDT) for gas and operations.
- Keep your `.env` file secure and never commit it to version control.
- Designed for Pharos testnet only — do **not** use mainnet keys or endpoints.

---

🤝 Contributing
Want to improve this tool or add new actions?
Pull requests and issues are welcome!

---

📄 License
MIT License © 2025 Gers08
