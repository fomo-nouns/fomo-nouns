const { Contract } = require("@ethersproject/contracts");
const { formatEther } = require('@ethersproject/units');

const { FOMO_SETTLER_ABI } = require('./abi.js');
const {
  FOMO_SETTLER_ADDR,
  DEFAULT_PRIORITY_FEE,
  DEFAULT_MAX_SETTLEMENT_COST
} = require('../ethereumConfig.js');


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
 * 
 * @param {Signer} signer Ethers Signer used to sign and send transaction
 * @param {String} blockhash Blockhash of the latest mined block
 * @param {String} fomoContractAddress Address of the FOMO Nouns Settler contract
 * @param {BigNumber} priorityFee Max priority fee to pay on top of the base fee
 * @param {BigNumber} maxSettlementCost Maximum all-in cost to pay for settlement
 */
async function submitSettlement(signer, blockhash, fomoContractAddress = FOMO_SETTLER_ADDR, priorityFee = DEFAULT_PRIORITY_FEE, maxSettlementCost = DEFAULT_MAX_SETTLEMENT_COST) {
  const provider = signer.provider;

  const fomoSettler = new Contract(fomoContractAddress, FOMO_SETTLER_ABI);

  console.log(`🔨 TRXN: Targeting settlement on ${targetBlock}...`);

  const feeData = await provider.getFeeData();
  const tx = await buildTransaction(fomoSettler, blockhash, feeData, priorityFee);

  console.log(tx);

  const cost = await simulateNormalTransaction(provider, tx);

  if (cost.lt(maxSettlementCost)) {
    await sendNormalTransaction(signer, tx);
  } else {
    console.log(`  ❌ NOT SETTLING: Total cost above ${formatEther(MAX_SETTLEMENT_COST)} limit`);
  }
}


module.exports = {
  submitSettlement
}