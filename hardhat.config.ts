import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const configs = require("./src/constant/config.js");
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    pharos: {
      url: configs.RPC_URL || configs.WSS_URL,
      chainId: Number(configs.CHAIN_ID) || 688688,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};

export default config;
