  module.exports = {
    NETWORK_NAME: "pharos-testnet",
    RPC_URL: "https://testnet.dplabs-internal.com",
    CHAIN_ID: "688688",

    MIN_BALANCE_TO_ACT: "0.01", // in PHRS, minimal wallet balance to continue actions

    ACTION_WEIGHTS: {
      Swap: 82,            // relative weight for Swap (82%)
      TransferToken: 15,   // 15%
      DeployToken: 1,      // 1%
      DeployNFT: 1,        // 1%
      DeployContract: 1,    // 1%
    },

    RANDOM_DELAY_MIN_MS: 45_000, // 45 seconds - minimum delay between actions
    RANDOM_DELAY_MAX_MS: 95_000, // 95 seconds - maximum delay between actions

    SWAP_MIN_AMOUNT: 1,    // minimum token amount to swap
    SWAP_MAX_AMOUNT: 10,   // maximum token amount to swap

    TRANSFER_AMOUNT_PHRS: "0.01", // default PHRS to transfer

    MAX_RETRIES: 3,         // max retry attempts for transactions
    TX_TIMEOUT_MS: 60_000,  // transaction confirmation timeout (ms)

    GAS_LIMIT: 21000,       // default gas limit (adjust as needed)
  };
