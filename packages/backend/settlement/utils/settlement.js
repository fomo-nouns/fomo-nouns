const { Contract } = require("ethers/contract");
const { formatEther } = require('ethers/utils');

const { FOMO_SETTLER_ABI } = require('./abi.js');
const {
  FOMO_SETTLER_ADDR,
  DEFAULT_PRIORITY_FEE,
  DEFAULT_MAX_SETTLEMENT_COST
} = require('../ethereumConfig.js');


const LOG_PROGRESS = true;
const logr = x => { if (LOG_PROGRESS) console.log(x); }


/**
 * Build the settlement transaction to execute
 */
async function buildTransaction(fomoSettler, blockhash, feeData, priorityFeePerGas = null) {
  if (priorityFeePerGas) {  // if (network === 'goerli') baseFeePerGas = baseFeePerGas.mul(GWEI);
    let maxPriorityFee = priorityFeePerGas > feeData.maxPriorityFeePerGas ? priorityFeePerGas : feeData.maxPriorityFeePerGas;

    feeData.maxFeePerGas = feeData.maxFeePerGas - feeData.maxPriorityFeePerGas + maxPriorityFee;
    feeData.maxPriorityFeePerGas = maxPriorityFee;

    delete feeData.gasPrice;
  }
  
  const tx = await fomoSettler.settleAuctionWithRefund.populateTransaction(
    blockhash,
    {...feeData, type: 2, blockTag: 'latest'}
  );
  tx.chainId = 1; //fomoSettler.provider.network.chainId;
  return tx;
}


/**
 * Simulate the gas cost of settlement
 */
async function simulateNormalTransaction(provider, tx) {
  const gasUsed = await provider.estimateGas(tx);
  const totalCost = gasUsed * tx.maxFeePerGas;

  logr(`  ⛽️ Gas Used: ${gasUsed}  💰 Max Cost: ${formatEther(totalCost)}`);

  return totalCost;
}


/**
 * Send the transaction and wait for response
 */
async function sendNormalTransaction(signer, tx) {
  try {
    const response = await signer.sendTransaction(tx);
    const receipt = await response.wait();

    if (receipt.status !== 1) {
      throw Error('Transaction reverted on chain');
    }
    
    logr(`  ✅ Transaction included in block ${receipt.blockNumber}`);
    return true;
  } catch(err) {
    logr(`  ❌ Transaction reverted\n${err}`);
    return false;
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
  const fomoSettler = new Contract(fomoContractAddress, FOMO_SETTLER_ABI, signer);

  logr(`🔨 TRXN: Launching settlement...`);

  let tx, cost;
  try {
    const feeData = await provider.getFeeData();
    tx = await buildTransaction(fomoSettler, blockhash, feeData, priorityFee);
    logr(tx);

    cost = await simulateNormalTransaction(provider, tx);
  } catch(err) {
    logr(`  ❌ ERROR: Cannot build and simulate trxn\n${err}`);
    return false;
  }
  

  if (cost.lt(maxSettlementCost)) {
    let result = await sendNormalTransaction(signer, tx);
    return result;
  } else {
    logr(`  ❌ NOT SETTLING: Total cost above ${formatEther(maxSettlementCost)} limit`);
    return false;
  }
}


module.exports = {
  submitSettlement
}