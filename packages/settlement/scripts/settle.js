const { ethers } = require('ethers');
const { abi, address } = require('./config.js');

const { parseUnits, parseEther, formatUnits, formatEther } = ethers.utils;

const GWEI = parseUnits('1', 'gwei');
const formatGwei = n => formatUnits(n, 'gwei');

const MAX_SETTLEMENT_COST = parseEther('0.1');


/**
 * SETTLEMENT TRANSACTION
 */
async function buildTransaction(feeData, priorityFeePerGas = null) {
  // if (network === 'goerli') baseFeePerGas = baseFeePerGas.mul(GWEI);
  if (priorityFeePerGas) {
    feeData.maxFeePerGas = feeData.maxFeePerGas.sub(feeData.priorityFeePerGas).add(priorityFeePerGas);
    feeData.maxPriorityFeePerGas = priorityFeePerGas;
  }
  
  const tx = await auctionHouse.populateTransaction.settleCurrentAndCreateNewAuction({...feeData, type: 2});
  tx.chainId = auctionHouse.provider.chainId;

  return tx;
}



/**
 * NORMAL TRANSACTION SIGNING & SENDING
 */
async function signNormalTransaction(signer, tx) {
  return await signer.signTransaction(tx);
}

async function sendNormalTransaction(signer, tx) {
  const response = await signer.sendTransaction(tx);
  const receipt = await response.wait();
  if (receipt.status === 1) {
    console.log(`✅ Transaction included in block ${receipt.block}`);
  } else {
    console.log(`❌ Transaction reverted`);
  }
}

async function simulateNormalTransaction(provider, tx) {
  const gasUsed = await provider.estimateGas(tx);
  const totalCost = gasUsed.mul(tx.maxFeePerGas);

  console.log(`  ⛽️ Gas Used: ${gasUsed}  💰 Max Cost: ${formatEther(totalCost)}`);

  return totalCost;
}



/**
 * FLASHBOTS SIGNING, SIMULATION, & SENDING
 */
async function signFlashbotsTransaction(provider, signer, tx) {
  const bundle = [{ signer: signer, transaction: tx }];
  return await provider.signBundle(bundle);
}

async function sendFlashbotsTransaction(provider, bundle, targetBlock) {
  const bundleResponse = await provider.sendBundle(bundle, targetBlock);
  if ('error' in bundleResponse) {
    throw new Error(bundleResponse.error.message);
  }

  const bundleResolution = await bundleResponse.wait()
  if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
    console.log(`✅ Transaction included in block ${targetBlockNumber}`);
  } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
    console.log(`🐢 Transaction missed block ${targetBlockNumber}`);
  } else {
    console.log(`❌ Transaction reverted`);
  }
}

async function simulateFlashbots(provider, signedBundle, targetBlock) {
  const simulation = await provider.simulate(signedBundle, targetBlock);

  if ('error' in simulation) {
    console.log(`💥 Simulation signalled error: ${simulation.error.reason}`);
    return false;
  }
  
  const totalCost = simulation.maxFeePerGas.mul(simulation.totalGasUsed);
  console.log(`  ⛽️ Gas Used: ${simulation.totalGasUsed}  💰 Max Cost: ${formatEther(totalCost)}`);

  return totalCost;
}



/**
 * MAIN SETTLEMENT FUNCTIONS
 */
async function settleNormally(auctionHouse, provider, signer, priorityFee = GWEI.mul(40)) {
  console.log(`🔨 TRXN: Targeting settlement on ${targetBlock}...`);

  const block = await provider.getBlock(targetBlock-1);

  const tx = await buildTransaction(block.baseFeePerGas, priorityFee);
  const signedTx = await signNormalTransaction(signer, tx);

  if (cost.lt(MAX_SETTLEMENT_COST)) {
    console.log(`  🤡 Skipping sending transaction for debugging...`);
    // await sendNormalTransaction(signer, signedTx);
  } else {
    console.log(`  ❌ NOT SETTLING: Total cost above ${formatEther(MAX_SETTLEMENT_COST)} limit`);
  }

  
}

async function settleFlashbots(auctionHouse, flashbotsProvider, signer, targetBlock) {
  console.log(`🤖 FLASHBOT: Targeting settlement on ${targetBlock}...`);

  const flashbotsPriorityFee = BigNumber.from(0); // Use contract tranansfer instead

  const block = await flashbotsProvider.getBlock(targetBlock-1);
  const tx = await buildTransaction(block.baseFeePerGas, flashbotsPriorityFee);

  const bundle = await signFlashbotsTransaction(flashbotsProvider, signer, tx);

  const cost = await simulateFlashbots(bundle, targetBlock);

  if (cost.lt(MAX_SETTLEMENT_COST)) {
    console.log(`  🤡 Skipping sending transaction for debugging...`);
    // await sendFlashbotsTransaction(bundle, targetBlock);
  } else {
    console.log(`  ❌ NOT SETTLING: Total cost above ${formatEther(MAX_SETTLEMENT_COST)} limit`);
  }
}

module.exports = {
  settleNormally,
  settleFlashbots
}