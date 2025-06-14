const { ethers } = require("hardhat");
const addresses = require("../src/constant/addresses");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`🚀 Deployer address: ${deployer.address}`);

  const Pool = await ethers.getContractFactory("UniswapPool");
  const pool = await Pool.deploy(addresses.ASSET_ONE, addresses.ASSET_TWO);
  await pool.waitForDeployment();

  const poolAddress = await pool.getAddress();
  console.log(`✅ UniswapPool deployed at: ${poolAddress}`);
}

main().catch((err) => {
  console.error("❌ Error deploying pool:", err);
  process.exit(1);
});
