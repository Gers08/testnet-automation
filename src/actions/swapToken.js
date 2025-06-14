const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = require("ethers");
const addresses = require("../constant/addresses");
const config = require("../constant/config");

// Get random amount to swap
async function getRandomSwapAmount(token, min = config.SWAP_MIN_AMOUNT, max = config.SWAP_MAX_AMOUNT) {
  const decimals = await token.decimals();
  const amount = Math.floor(Math.random() * (max - min + 1)) + min;
  return parseUnits(amount.toString(), decimals);
}

// Approve if needed
async function approveIfNeeded(token, spender, user, amount) {
  const allowance = await token.allowance(user.address, spender);
  if (allowance < amount) {
    console.log(`🔐 Approving ${spender} to spend ${await token.symbol()}...`);
    const tx = await token.connect(user).approve(spender, ethers.MaxUint256);
    await tx.wait();
    console.log("✅ Approval successful.");
  } else {
    console.log(`✅ ${await token.symbol()} already approved.`);
  }
}

// Main swap function
async function swapToken() {
  try {
    const [user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const ASSET_ONE = Token.attach(addresses.ASSET_ONE);
    const ASSET_TWO = Token.attach(addresses.ASSET_TWO);

    const Pool = await ethers.getContractFactory("UniswapPool");
    const uniswap = Pool.attach(addresses.UniswapPool);

    const decimalsOne = await ASSET_ONE.decimals();
    const decimalsTwo = await ASSET_TWO.decimals();

    const [assetTwoReserve, assetOneReserve] = await uniswap.getReserves();
    const assetTwoReserveAmount = parseFloat(formatUnits(assetTwoReserve, decimalsTwo));
    const assetOneReserveAmount = parseFloat(formatUnits(assetOneReserve, decimalsOne));
    const targetRatio = 1;

    const ratio = assetTwoReserveAmount / assetOneReserveAmount;
    const differencePercent = Math.abs(ratio - targetRatio) / targetRatio * 100;

    // Choose which asset to swap and use its decimals
    const isImbalanced = differencePercent > 10;
    const shouldUseAssetTwo = assetTwoReserveAmount > assetOneReserveAmount;
    const tokenToSwap = isImbalanced ? (shouldUseAssetTwo ? ASSET_TWO : ASSET_ONE) : ASSET_ONE;
    const decimalsToUse = tokenToSwap === ASSET_ONE ? decimalsOne : decimalsTwo;
    const label = await tokenToSwap.symbol();

    const amountToSwap = await getRandomSwapAmount(tokenToSwap, config.SWAP_MIN_AMOUNT, config.SWAP_MAX_AMOUNT);

    const balance = await tokenToSwap.balanceOf(user.address);
    if (balance < amountToSwap) {
      console.log(`❌ Insufficient ${label} for swap.`);
      return;
    }

    await approveIfNeeded(tokenToSwap, addresses.UniswapPool, user, amountToSwap);

    console.log(`🔁 Swapping ${formatUnits(amountToSwap, decimalsToUse)} ${label} ...`);
    const tx = await uniswap.swap(await tokenToSwap.getAddress(), amountToSwap);
    await tx.wait();
    console.log(`✅ Succecssfully swapped ${formatUnits(amountToSwap, decimalsToUse)} ${label}. Balance after swap: ${formatUnits(await tokenToSwap.balanceOf(user.address), decimalsToUse)}`);
  } catch (error) {
    console.error("❌ Error in swapToken:", error || error);
  }
}

module.exports = swapToken;
