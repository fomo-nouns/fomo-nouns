const { ethers, network } = require('hardhat');


async function impersonateAccount(address){
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address]}
  )
}

async function stopImpersonatingAccount(address){
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [address]}
  )
}

async function networkReset(block){
  await network.provider.request({
    method: "hardhat_reset",
    params: [{
      forking: {
        jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
        blockNumber: block 
      }
    }]
  })
}


async function setEtherBalance(addr, etherAmount) {
  const etherHex = ethers.utils.parseEther(String(etherAmount)).toHexString().replace(/0x0+/, "0x");
  await network.provider.send('hardhat_setBalance', [addr, etherHex]);
}

// The following adapted from `https://github.com/compound-finance/compound-protocol/blob/master/tests/Utils/Ethereum.js`
function BigNumber(number) {
  return ethers.BigNumber.from(number);
}

function UInt256Max() {
  return ethers.constants.MaxUint256;
}

function address(n) {
  return `0x${n.toString(16).padStart(40, '0')}`;
}

function encodeParameters(types, values) {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
}

async function etherBalance(addr) {
  return new BigNumber(await ethers.provider.getBalance(addr));
}

async function etherGasCost(receipt) {
  const tx = await ethers.provider.getTransaction(receipt.transactionHash);
  const gasUsed = new BigNumber(receipt.gasUsed);
  const gasPrice = new BigNumber(tx.gasPrice);
  return gasUsed.times(gasPrice);
}

function etherExp(num) { return etherMantissa(num, 1e18) }
function etherDouble(num) { return etherMantissa(num, 1e36) }
function etherMantissa(num, scale = 1e18) {
  if (num < 0)
    return new BigNumber(2).pow(256).plus(num);
  return new BigNumber(num).times(scale);
}

function etherUnsigned(num) {
  return new BigNumber(num);
}

function keccak256(values) {
  return ethers.utils.keccak256(values);
}

async function mineBlockNumber(blockNumber) {
  return rpc({method: 'evm_mineBlockNumber', params: [blockNumber]});
}

async function mineBlock() {
  return rpc({ method: 'evm_mine' });
}

async function increaseTime(seconds) {
  await rpc({ method: 'evm_increaseTime', params: [seconds] });
  return rpc({ method: 'evm_mine' });
}

async function setTime(seconds) {
  await rpc({ method: 'evm_setTime', params: [new Date(seconds * 1000)] });
}

async function freezeTime(seconds) {
  await rpc({ method: 'evm_freezeTime', params: [seconds] });
  return rpc({ method: 'evm_mine' });
}

async function advanceBlocks(blocks) {
  let { result: num } = await rpc({ method: 'eth_blockNumber' });
  await rpc({ method: 'evm_mineBlockNumber', params: [blocks + parseInt(num)] });
}

async function blockNumber() {
  let { result: num } = await rpc({ method: 'eth_blockNumber' });
  return parseInt(num);
}

async function minerStart() {
  return rpc({ method: 'miner_start' });
}

async function minerStop() {
  return rpc({ method: 'miner_stop' });
}

async function rpc(request) {
  return new Promise((okay, fail) => network.provider.send(request, (err, res) => err ? fail(err) : okay(res)));
}

async function both(contract, method, args = [], opts = {}) {
  const reply = await call(contract, method, args, opts);
  const receipt = await send(contract, method, args, opts);
  return { reply, receipt };
}


module.exports = {
  impersonateAccount,
  stopImpersonatingAccount,
  networkReset,

  setEtherBalance,

  address,
  encodeParameters,
  etherBalance,
  etherGasCost,
  etherExp,
  etherDouble,
  etherMantissa,
  etherUnsigned,
  keccak256,

  advanceBlocks,
  blockNumber,
  freezeTime,
  increaseTime,
  mineBlock,
  mineBlockNumber,
  minerStart,
  minerStop,
  rpc,
  setTime,

  both,
  UInt256Max
};