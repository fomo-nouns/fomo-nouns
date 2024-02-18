const { Contract } = require("ethers/contract");
const { formatEther } = require('ethers/utils');
const { nextAuctionNounId } = require('./nouns.js');

const { FOMO_SETTLER_ABI, AUCTION_HOUSE_ABI } = require('./abi.js');
const {
  FOMO_SETTLER_ADDR,
  AUCTION_HOUSE_ADDR,
  MAX_BASE_FEE,
  PRIORITY_FEE,
  WARM_UP_PERIOD
} = require('../ethereumConfig.js');


const LOG_PROGRESS = true;
const logr = x => { if (LOG_PROGRESS) console.log(x); }


/**
 * Build the settlement transaction to execute
 */
async function buildTransaction(fomoSettler, blockhash, maxBaseFeePerGas, priorityFeePerGas) {
  
  const tx = await fomoSettler.settleAuctionWithRefund.populateTransaction(
    blockhash,
    {
      type: 2,
      from: fomoSettler.runner.address,
      maxFeePerGas: maxBaseFeePerGas,
      maxPriorityFeePerGas: priorityFeePerGas,
      gasLimit: 650_000
    }
  );
  tx.chainId = fomoSettler.runner.provider.chainId; //fomoSettler.provider.network.chainId;
  return tx;
}


/**
 * Validate the request to settle
 */
async function validateRequest(nounId, blockhash, auctionHouse) {
  let block = await auctionHouse.runner.provider.getBlock();
  let auction = await auctionHouse.auction();

  if (block.hash !== blockhash) {
    throw Error(`Requested blockhash ${blockhash} does not match latest block ${block.hash}`);
  } else if (auction.endTime > block.timestamp) {
    throw Error(`Auction has not yet ended`);
  } else if (auction.endTime + WARM_UP_PERIOD > block.timestamp) {
    throw Error(`Settlement requested too soon after auction end`);
  } else if (nounId != nextAuctionNounId(auction.nounId)) {
    throw Error(`Requested nounId ${nounId} is not next auctioned nounId after ${auction.nounId}`);
  }
}


/**
 * Send the transaction and wait for response
 */
async function sendNormalTransaction(signer, tx) {
  try {
    const response = await signer.sendTransaction(tx);
    logr(`  📡 Transaction sent: ${response}`);

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
 * @param {number} nounId Noun ID to confirm
 * @param {String} blockhash Blockhash of the latest mined block
 * @param {String} fomoContractAddress Address of the FOMO Nouns Settler contract
 * @param {BigNumber} priorityFee Max priority fee to pay on top of the base fee
 * @param {BigNumber} maxSettlementCost Maximum all-in cost to pay for settlement
 */
async function submitSettlement(signer, nounId, blockhash, fomoContractAddress = FOMO_SETTLER_ADDR, auctionHouseAddress = AUCTION_HOUSE_ADDR, baseFee = MAX_BASE_FEE, priorityFee = PRIORITY_FEE) {
  const fomoSettler = new Contract(fomoContractAddress, FOMO_SETTLER_ABI, signer);
  const auctionHouse = new Contract(auctionHouseAddress, AUCTION_HOUSE_ABI, signer.provider);

  logr(`🔬 VALIDATION: Checking request for ${nounId} @ ${blockhash}...`);
  try {
    await validateRequest(nounId, blockhash, auctionHouse);
    logr(`  ✅ OK: Request is valid`);
  } catch(err) {
    logr(`  ❌ ERROR: Cannot validate request\n${err}`);
    return false;
  }

  logr(`🔨 TRXN: Launching settlement...`);
  try {
    let tx = await buildTransaction(fomoSettler, blockhash, baseFee, priorityFee);
    logr(tx);

    const totalCost = tx.gasLimit * tx.maxFeePerGas;
    logr(`  ⛽️ GAS: ${tx.gasLimit}  💰 Max Cost: ${formatEther(totalCost)}`);

    logr(`  🚀 SENDING: Submitting transaction to network...`)
    let result = await sendNormalTransaction(signer, tx);

    logr(`  🏁 DONE: Settlement ${result ? 'suceeded' : 'failed'}`);
    return result;
  } catch(err) {
    logr(`  ❌ ERROR: Cannot build, simulate, or send trxn:\n${err}`);
    return false;
  }
}


module.exports = {
  submitSettlement
}