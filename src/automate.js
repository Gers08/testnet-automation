const { ethers } = require("hardhat");
const config = require("./constant/config");
const crypto = require('crypto');
const retry = require("../src/helper/retry");
const { parseUnits, formatUnits } = require("ethers");
const { transferToken, deployToken, deployNFT, deployContract, swapToken } = require("./actions");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomDelay(min = config.RANDOM_DELAY_MIN_MS, max = config.RANDOM_DELAY_MAX_MS) {
  const base = Math.floor(Math.random() * (max - min + 1) + min);
  const jitterPercent = (Math.random() * 0.2) - 0.1; // ±10%
  const jitter = Math.floor(base * jitterPercent);
  return base + jitter;
}


function weightedRandomAction(weights) {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((acc, [, w]) => acc + w, 0);
  const rand = crypto.randomInt(0, totalWeight);

  let sum = 0;
  for (const [action, weight] of entries) {
    sum += weight;
    if (rand < sum) return action;
  }
}

async function simulateAction(signer) {
  const balance = await signer.provider.getBalance(signer.address);
  const formatted = formatUnits(balance, 18);
  console.log(`💼 Wallet balance: ${formatted} PHRS`);

  if (balance <= parseUnits(config.MIN_BALANCE_TO_ACT, 18)) {
    console.log("❌ Low balance. Skipping this round.");
    return;
  }

  const choice = weightedRandomAction(config.ACTION_WEIGHTS);
  console.log(`🎲 Selected action: ${choice}`);

  switch (choice) {
    case "Swap":
      await swapToken();
      break;
    case "TransferToken":
      await transferToken(signer);
      break;
    case "DeployToken":
      await deployToken(signer);
      break;
    case "DeployNFT":
      await deployNFT(signer);
      break;
    case "DeployContract":
      await deployContract(signer);
      break;
  }
}

async function main() {
  const [signer] = await ethers.getSigners();
  let round = 1;

  while (true) {
    console.log(`\n🔁 Round ${round++} starting...`);

    try {
      await retry(() => simulateAction(signer));
    } catch (err) {
      console.error("⚠️ Action failed:", err.message);
    }

    const delay = getRandomDelay();
    console.log(`⏳ Sleeping ${(delay / 1000).toFixed(2)}s before next round...\n`);
    await sleep(delay);
  }
}

main();
