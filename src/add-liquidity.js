const hre = require("hardhat");
const { ethers } = hre;
const { parseUnits, formatUnits } = ethers;
const config = require("../src/constant/config");
const addresses = require("../src/constant/addresses");

const MAX_UINT = ethers.MaxUint256;

async function approveIfNeeded(tokenContract, spender, user) {
  try {
    const spenderAddress = await spender.getAddress();
    const userAddress = user.address;

    const allowance = await tokenContract.allowance(userAddress, spenderAddress);
    const tokenName = await tokenContract.name();

    if (allowance >= MAX_UINT / 2n) {
      console.log(`✅ Already approved ${spenderAddress} for ${tokenName}`);
      return;
    }

    console.log(`🔐 Approving ${spenderAddress} to spend ${tokenName}...`);
    const tx = await tokenContract.connect(user).approve(spenderAddress, MAX_UINT);
    await tx.wait();
    console.log("✅ Approval successful.");
  } catch (err) {
    console.error(`❌ Approval failed for ${await tokenContract.name()}:`, err.message || err);
    throw new Error("Approval step failed.");
  }
}

async function addLiquidityIfNeeded() {
  try {
    const [deployer] = await ethers.getSigners();
    if (!deployer) throw new Error("❌ No signer available.");

    const Token = await ethers.getContractFactory("Token");
    const Uniswap = await ethers.getContractFactory("Uniswap");

    const USDT = Token.attach(addresses.USDT);
    const USDC = Token.attach(addresses.USDC);
    const uniswap = Uniswap.attach(addresses.SWAP_ROUTER);

    if (!USDT || !USDC || !uniswap) throw new Error("❌ Invalid contract attachments.");

    const amount = config.AMOUNT_OF_LIQIUDITY;
    const amountA = parseUnits(amount, 18); // USDT
    const amountB = parseUnits(amount, 18); // USDC

    console.log(`\n👤 Using signer: ${deployer.address}`);
    console.log("🔍 Validating approvals...");

    await approveIfNeeded(USDT, uniswap, deployer);
    await approveIfNeeded(USDC, uniswap, deployer);

    console.log(`🔄 Adding liquidity: ${formatUnits(amountA)} USDT and ${formatUnits(amountB)} USDC...`);
    const tx = await uniswap.connect(deployer).addLiquidity(amountA, amountB);
    await tx.wait();

    console.log("✅ Liquidity added successfully.\n");
  } catch (err) {
    console.error("🚨 Liquidity addition failed:", err.message || err);
    process.exit(1);
  }
}

addLiquidityIfNeeded();