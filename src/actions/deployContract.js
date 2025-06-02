const { ethers } = require("hardhat");

async function deployContract() {
  try {
    console.log("🚀 Deploying DummyContract...");

    const Dummy = await ethers.getContractFactory("DummyContract");
    const dummy = await Dummy.deploy();

    const tx = dummy.deploymentTransaction();
    console.log(`📄 Deployment transaction sent. Tx hash: ${tx.hash}`);

    const deployed = dummy.waitForDeployment()

    const address = await dummy.getAddress();
    console.log(`✅ DummyContract deployed at: ${address}`);

    return { address, txHash: tx.hash };
  } catch (error) {
    console.error("❌ Error deploying DummyContract:", error);
    throw error;
  }
}

module.exports = deployContract;
