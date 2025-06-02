const { ethers } = require("hardhat");
// Uncomment to Save deployment info locally (optional)
// const fs = require("fs");
// const path = require("path");

async function deployNFT(signer) {
  if (!signer) {
    throw new Error("Signer (wallet) is required to deploy and mint NFT.");
  }

  try {
    console.log("🚀 Starting NFT (ERC721) deployment...");

    const NFT = await ethers.getContractFactory("Nft", signer);

    // Deploy contract
    const nft = await NFT.deploy();
    const tx = nft.deploymentTransaction();
    console.log(`📡  Deployment transaction hash: ${tx.hash}`);
    await nft.waitForDeployment();
    const address = await nft.getAddress();
    console.log(`✅  NFT contract deployed at: ${address}`);

    // Mint 1 NFT to the signer's address
    const userAddress = await signer.getAddress();
    console.log(`🎨  Minting 1 NFT to address: ${userAddress} ...`);

    const mintTx = await nft.mint(userAddress);
    console.log(`📡  Mint transaction hash: ${mintTx.hash}`);
    await mintTx.wait();
    console.log(`✅  Mint successful!`);

    // Uncomment to Save deployment info locally (optional)

    // const assetsDir = path.join(__dirname, "..", "deployed-assets");
    // const filePath = path.join(assetsDir, "deployedNFT.json");

    // // Ensure directory exists
    // if (!fs.existsSync(assetsDir)) {
    //   fs.mkdirSync(assetsDir, { recursive: true });
    //   console.log(`📂 Created directory: ${assetsDir}`);
    // }
    // const deploymentInfo = {
    //   nftAddress: address,
    //   mintedTo: userAddress,
    //   deployedAt: new Date().toISOString(),
    //   deployTxHash: tx.hash,
    //   mintTxHash: mintTx.hash,
    // };

    // let nftList = [];
    // if (fs.existsSync(filePath)) {
    //   try {
    //     const fileData = fs.readFileSync(filePath, "utf-8");
    //     nftList = JSON.parse(fileData);
    //     if (!Array.isArray(nftList)) nftList = [];
    //   } catch (err) {
    //     console.warn("⚠️ Warning: Failed to parse deployedNFT.json, starting fresh.");
    //     nftList = [];
    //   }
    // }

    // nftList.push(deploymentInfo);
    // fs.writeFileSync(filePath, JSON.stringify(nftList, null, 2));
    // console.log(`💾 Deployment info saved to deployedNFT.json`);

    return address;
  } catch (error) {
    console.error("❌ Error during deployNFT:", error);
    throw error;
  }
}

module.exports = deployNFT;
