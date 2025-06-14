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

async function addLiquidity() {
  try {
    const [deployer] = await ethers.getSigners();
    if (!deployer) throw new Error("❌ No signer available.");

    const Token = await ethers.getContractFactory("Token");
    const Uniswap = await ethers.getContractFactory("UniswapPool");

    const ASSET_ONE = Token.attach(addresses.ASSET_ONE);
    const ASSET_TWO = Token.attach(addresses.ASSET_TWO);
    const uniswap = Uniswap.attach(addresses.UniswapPool);

    if (!ASSET_ONE || !ASSET_TWO || !uniswap) throw new Error("❌ Invalid contract attachments.");

    const decimalsOne = await ASSET_ONE.decimals();
    const decimalsTwo = await ASSET_TWO.decimals();

    const amount = config.AMOUNT_OF_LIQUIDITY.toString();
    const amountOfASSET_ONE = parseUnits(amount, decimalsOne); // ASSET_ONE
    const amountOfASSET_TWO = parseUnits(amount, decimalsTwo); // ASSET_TWO

    console.log(`\n👤 Using signer: ${deployer.address}`);
    console.log("🔍 Validating approvals...");

    await approveIfNeeded(ASSET_ONE, uniswap, deployer);
    await approveIfNeeded(ASSET_TWO, uniswap, deployer);

    console.log(`🔄 Adding liquidity: ${formatUnits(amountOfASSET_ONE, decimalsOne)} ASSET_ONE and ${formatUnits(amountOfASSET_TWO, decimalsTwo)} ASSET_TWO ...`);
    const tx = await uniswap.connect(deployer).addLiquidity(amountOfASSET_ONE, amountOfASSET_TWO);
    await tx.wait();

    console.log("✅ Liquidity added successfully.\n");
  } catch (err) {
    console.error("🚨 Liquidity addition failed:", err.message || err);
    process.exit(1);
  }
}

addLiquidity();