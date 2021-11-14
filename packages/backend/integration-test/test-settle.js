const { ethers } = require('ethers');
const { WebSocket } = require('ws');

const { FOMO_ALCHEMY_KEY } = process.env;


// Configuration
const voteOptions = ['voteLove','voteLike','voteDislike','voteHate'];
const voteEmoji = {'voteLove': '💕', 'voteLike': '👍', 'voteDislike': '👎', 'voteHate': '🤢'};
const numUsers = 4;
const auctionHouseAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bool","name":"extended","type":"bool"}],"name":"AuctionBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"AuctionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"AuctionExtended","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minBidIncrementPercentage","type":"uint256"}],"name":"AuctionMinBidIncrementPercentageUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reservePrice","type":"uint256"}],"name":"AuctionReservePriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AuctionSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timeBuffer","type":"uint256"}],"name":"AuctionTimeBufferUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"auction","outputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"address payable","name":"bidder","type":"address"},{"internalType":"bool","name":"settled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"nounId","type":"uint256"}],"name":"createBid","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"duration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract INounsToken","name":"_nouns","type":"address"},{"internalType":"address","name":"_weth","type":"address"},{"internalType":"uint256","name":"_timeBuffer","type":"uint256"},{"internalType":"uint256","name":"_reservePrice","type":"uint256"},{"internalType":"uint8","name":"_minBidIncrementPercentage","type":"uint8"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minBidIncrementPercentage","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nouns","outputs":[{"internalType":"contract INounsToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reservePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_minBidIncrementPercentage","type":"uint8"}],"name":"setMinBidIncrementPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reservePrice","type":"uint256"}],"name":"setReservePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timeBuffer","type":"uint256"}],"name":"setTimeBuffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settleAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settleCurrentAndCreateNewAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timeBuffer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const auctionHouseProxyAddress = '0x7cb0384b923280269b3BD85f0a7fEaB776588382';


// Basic Setup
const websocketURL = process.argv[2];
console.log(`Websocket URL: ${websocketURL}`);

const provider = new ethers.providers.AlchemyProvider('rinkeby', FOMO_ALCHEMY_KEY);
const socket = new ethers.providers.AlchemyWebSocketProvider('rinkeby', FOMO_ALCHEMY_KEY);
const auctionHouse = new ethers.Contract(auctionHouseProxyAddress, auctionHouseAbi, provider);


// Functions
const nowSeconds = () => Math.floor(Date.now() / 1000);
const pause = (seconds) => new Promise(r => setTimeout(r, seconds * 1000));

function createWebsockets(count) {
  let sockets = [];
  for (let i=0; i < count; i++) {
    let newSocket = new WebSocket(websocketURL);
    sockets.push(newSocket);
  }
  return sockets;
}

async function waitForAuctionEnd() {
  let auction = await auctionHouse.auction();

  while (nowSeconds() < auction.endTime) {
    await pause(auction.endTime - nowSeconds());
    auction = await auctionHouse.auction();
  }

  return auction.nounId+1; // Return next Noun ID
}

function generateVotes(count) {
  return new Array(count).fill('').map(() =>
    voteOptions[Math.floor(Math.random()*voteOptions.length)]
  );
}

async function waitForNextBlock() {
  return await new Promise(function(resolve, reject) {
    socket.once('block', async (blockNumber) => {
      resolve(blockNumber);
    });
  });
}

async function castVotes(sockets, nounId, blockNumber, votes) {
  const block = await provider.getBlock(blockNumber);
  const blockhash = block.hash;

  sockets.map((socket,i) => {
    let vote = votes[i];
    let msg = {"action": "sendvote", "nounId": nounId, "blockhash": blockhash, "vote": vote};
    socket.send(JSON.stringify(msg));
  });
  console.log(`  🎯 Target ${blockNumber+1} with prior hash ${blockhash}`);
}


// Run the Script
async function main() {
  const wsArray = createWebsockets(numUsers);
  console.log(`📡 Created ${numUsers} websocket connections`);

  const votes = generateVotes(numUsers);
  console.log(`👨‍💼 User votes: ${votes.map(v => voteEmoji[v]).join(' ')}`);

  console.log(`⏳ Waiting for Noun auction to end...`);
  const newNounId = await waitForAuctionEnd();

  console.log(`⏳ Waiting for next block...`);
  const latestBlockNumber = await waitForNextBlock();
  console.log(`🚀 Block ${latestBlockNumber} just mined`);

  console.log(`🗳  Casting votes...`);
  await castVotes(wsArray, newNounId, latestBlockNumber, votes);
  console.log(`✅ Voting complete`);

  console.log('🛫 Waiting for broadcast to occur...')
  await pause(10);
  console.log('🛬 Waiting period over')

  console.log(`🎬 Closing all connections...`);
  wsArray.map(s => s.close());
  console.log(`👋 👋 👋`);
}

// Run
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });