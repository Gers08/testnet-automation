const { ethers } = require("ethers");
const config = require("../constant/config");
const addresses = require("../constant/addresses");

function getRandomAddress() {
  const recipients = addresses.TRANSFER_RECIPIENTS;
  const randomIndex = Math.floor(Math.random() * recipients.length);
  return recipients[randomIndex];
}

async function transferToken(wallet) {
  const transferToAddress = getRandomAddress();

  try {
    if (!ethers.isAddress(transferToAddress)) {
      throw new Error(`Invalid recipient address: ${transferToAddress}`);
    }

    let amount;
    try {
      amount = ethers.parseEther(config.TRANSFER_AMOUNT_PHRS);
    } catch {
      throw new Error(`Invalid amount format: ${config.TRANSFER_AMOUNT_PHRS}`);
    }

    const senderAddress = await wallet.getAddress();
    const balance = await wallet.provider.getBalance(senderAddress);

    const { gasPrice } = await wallet.provider.getFeeData(); 
    const gasLimit = BigInt(config.GAS_LIMIT);
    const totalCost = amount + gasLimit * gasPrice;

    if (balance < totalCost) {
      throw new Error(
        `Insufficient balance. Balance: ${ethers.formatEther(balance)} PHRS, required (amount + gas): ${ethers.formatEther(totalCost)} PHRS`
      );
    }

    console.log(`Sending ${config.TRANSFER_AMOUNT_PHRS} PHRS from ${senderAddress} to ${transferToAddress}...`);

    const tx = await wallet.sendTransaction({
      to: transferToAddress,
      value: amount,
      gasLimit,
      gasPrice,
    });

    console.log(`Transaction sent. Tx hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Transaction confirmed!`);

    return tx.hash;

  } catch (error) {
    console.error("Error sending PHRS:", error.message || error);
  }
}

module.exports = transferToken;
