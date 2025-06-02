const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = require("ethers");
const addresses = require("../constant/addresses");
const config = require("../constant/config");

const MAX_UINT = ethers.MaxUint256;

// Action Delay
function getRandomSwapAmount(min = config.SWAP_MIN_AMOUNT, max = config.SWAP_MAX_AMOUNT) {
  const amount = Math.floor(Math.random() * (max - min + 1)) + min;
  return parseUnits(amount.toString(), 18);
}

// Approve once with unlimited allowance
async function approveOnce(token, spender, user) {
  const spenderAddress = await spender.getAddress();
  const decimals = await token.decimals();
  const allowance = await token.allowance(user.address, spenderAddress);

  if (parseFloat(formatUnits(allowance, decimals)) > 0) return;

  console.log(`🔐 Approving unlimited allowance to ${spenderAddress}...`);
  const tx = await token.approve(spenderAddress, MAX_UINT);
  await tx.wait();
  console.log("✅ Unlimited approval successful.");
}

// Swap logic
async function performSwap(uniswap, amount, token, user, label) {
  const balance = await token.balanceOf(user.address);
  const decimals = await token.decimals();

  if (balance < amount) {
    console.log(`❌ Insufficient ${label} for swap.`);
    return;
  }

  await approveOnce(token, uniswap, user);

  const nonce = await user.provider.getTransactionCount(user.address);
  if (label === "USDT") {
    const tx = await uniswap.swapAToB(amount, { nonce });
    await tx.wait();
  } else {
    const tx = await uniswap.swapBToA(amount, { nonce });
    await tx.wait();
  }

  console.log(`✅ Swapped ${formatUnits(amount, decimals)} ${label}`);
  console.log(`💰 ${label} Balance: ${formatUnits(balance, decimals)}`);
}

// Main swap function
async function swapOnly() {
  try {
    const [user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const USDT = Token.attach(addresses.USDT);
    const USDC = Token.attach(addresses.USDC);

    const Uniswap = await ethers.getContractFactory("Uniswap");
    const uniswap = Uniswap.attach(addresses.SWAP_ROUTER);

    const [reserveA, reserveB] = await uniswap.getReserves();
    const reserveANum = parseFloat(formatUnits(reserveA, 18));
    const reserveBNum = parseFloat(formatUnits(reserveB, 18));
    const targetRatio = 1;

    const ratio = reserveANum / reserveBNum;
    const differencePercent = Math.abs(ratio - targetRatio) / targetRatio * 100;

    const amountToSwap = getRandomSwapAmount();

    if (differencePercent > 10) {
      if (reserveANum > reserveBNum) {
        await performSwap(uniswap, amountToSwap, USDC, user, "USDC");
      } else {
        await performSwap(uniswap, amountToSwap, USDT, user, "USDT");
      }
    } else {
      await performSwap(uniswap, amountToSwap, USDT, user, "USDT");
    }

  } catch (error) {
    console.error("❌ Error in swapOnly:", error.message || error);
  }
}

module.exports = { swapOnly };
