const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = require("ethers");
const path = require('path');
const fs = require('fs');


function randomTokenData() {
  const adjectives = ["Fast", "Cool", "Bright", "Smart", "Happy"];
  const nouns = ["Lion", "Tiger", "Eagle", "Shark", "Wolf"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const name = `${adj}${noun}Token`;
  const symbol = name.substring(0, 4).toUpperCase();
  const supply = parseUnits((Math.floor(Math.random() * 900_000) + 100_000).toString(), 18);
  return { name, symbol, supply };
}

async function deployToken() {
  const { name, symbol, supply } = randomTokenData();
  console.log(`Deploying Token: ${name} (${symbol}) with supply ${formatUnits(supply, 18)}`);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(name, symbol, supply);

  await token.waitForDeployment();
  const tx = token.deploymentTransaction();
  const tokenAddress = await token.getAddress();

  // Define directory and file path
    const assetsDir = path.join(__dirname, "..", "deployed-assets");
    const filePath = path.join(assetsDir, "deployedToken.json");

    // Ensure directory exists
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
      console.log(`📂 Created directory: ${assetsDir}`);
    }

  const data = {
    tokenAddress,
    deployedAt: new Date().toISOString(),
    txHash: tx.hash,
    name,
    symbol,
    supply: formatUnits(supply, 18),
  };

  let tokenList = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    try {
      tokenList = JSON.parse(fileData);
      if (!Array.isArray(tokenList)) tokenList = [];
    } catch {
      tokenList = [];
    }
  }

  tokenList.push(data);
  fs.writeFileSync(filePath, JSON.stringify(tokenList, null, 2));
  console.log("Deployment info saved to deployedToken.json");

  return tokenAddress;
}

module.exports = deployToken;