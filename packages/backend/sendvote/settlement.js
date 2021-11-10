// const { Wallet, Contract } = require('ethers');
const { Contract } = require('ethers');
const { parseUnits, parseEther, formatEther } = require('@ethersproject/units');
// const { AlchemyProvider } = require('@ethersproject/providers');

const {
  nounsSettlerAddress,
  nounsSettlerAbi
} = require('./ethereumConfig.js');

const GWEI = parseUnits('1', 'gwei');
const DEFAULT_PRIORITY_FEE = GWEI.mul(20);
const MAX_SETTLEMENT_COST = parseEther('0.06');


/**
 * Build the settlement transaction to execute
 */
async function buildTransaction(fomoSettler, blockhash, feeData, priorityFeePerGas = null) {
  if (priorityFeePerGas) {  // if (network === 'goerli') baseFeePerGas = baseFeePerGas.mul(GWEI);
    let maxPriorityFee = priorityFeePerGas.gt(feeData.maxPriorityFeePerGas) ? priorityFeePerGas : feeData.maxPriorityFeePerGas;

    feeData.maxFeePerGas = feeData.maxFeePerGas.sub(feeData.maxPriorityFeePerGas).add(maxPriorityFee);
    feeData.maxPriorityFeePerGas = maxPriorityFee;

    delete feeData.gasPrice;
  }
  
  const tx = await fomoSettler.populateTransaction.settleAuctionWithRefund(blockhash, {...feeData, type: 2});
  tx.chainId = fomoSettler.provider.network.chainId;
  return tx;
}


/**
 * Simulate the gas cost of settlement
 */
async function simulateNormalTransaction(provider, tx) {
  const gasUsed = await provider.estimateGas(tx);
  const totalCost = gasUsed.mul(tx.maxFeePerGas);

  console.log(`  ⛽️ Gas Used: ${gasUsed}  💰 Max Cost: ${formatEther(totalCost)}`);

  return totalCost;
}


/**
 * Send the transaction and wait for response
 */
async function sendNormalTransaction(signer, tx) {
  const response = await signer.sendTransaction(tx);
  const receipt = await response.wait();
  if (receipt.status === 1) {
    console.log(`  ✅ Transaction included in block ${receipt.blockNumber}`);
  } else {
    console.log(`  ❌ Transaction reverted`);
  }
}


/**
 * Overall settlement function
 */
async function submitSettlement(signer, blockhash, priorityFee = DEFAULT_PRIORITY_FEE) {
  const provider = signer.provider;

  const fomoSettler = new Contract(nounsSettlerAddress, nounsSettlerAbi);

  console.log(`🔨 TRXN: Targeting settlement on ${targetBlock}...`);

  const feeData = await provider.getFeeData();
  const tx = await buildTransaction(fomoSettler, blockhash, feeData, priorityFee);

  console.log(tx);

  const cost = await simulateNormalTransaction(provider, tx);

  if (cost.lt(MAX_SETTLEMENT_COST)) {
    await sendNormalTransaction(signer, tx);
  } else {
    console.log(`  ❌ NOT SETTLING: Total cost above ${formatEther(MAX_SETTLEMENT_COST)} limit`);
  }
}


module.exports = {
  submitSettlement
}