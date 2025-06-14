  module.exports = {
    NETWORK_NAME: "pharos-testnet",
    RPC_URL: "https://testnet.dplabs-internal.com",
    WSS_URL: "wss://testnet.dplabs-internal.com",
    CHAIN_ID: "688688",

    MIN_BALANCE_TO_ACT: "0.01", // in PHRS, minimal wallet balance to continue actions

    ACTION_WEIGHTS: {
      Swap: 89,            // relative weight for Swap (89%)
      TransferToken: 9.5,   // 9.5%
      DeployToken: 0.5,      // 0.5%
      DeployNFT: 0.5,        // 0.5%
      DeployContract: 0.5,    // 0.5%
    },

    RANDOM_DELAY_MIN_MS: 25_000, // 25 seconds - minimum delay between actions
    RANDOM_DELAY_MAX_MS: 95_000, // 95 seconds - maximum delay between actions

    AMOUNT_OF_LIQUIDITY: 200, // amount of liquidity to add to the pool (both tokens)
    SWAP_MIN_AMOUNT: 1,    // minimum token amount to swap
    SWAP_MAX_AMOUNT: 10,   // maximum token amount to swap

    TRANSFER_AMOUNT_PHRS: "0.01", // default PHRS to transfer

    MAX_RETRIES: 3,         // max retry attempts for transactions
    TX_TIMEOUT_MS: 60_000,  // transaction confirmation timeout (ms)

    GAS_LIMIT: 21000,       // default gas limit (adjust as needed)
  };
