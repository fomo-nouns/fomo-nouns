const { network, ethers } = require('hardhat');
const { abi, address } = require('./config.js');
// const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
const { settleNormally, settleFlashbots } = require('./settle.js');

const { Wallet } = ethers;
const { AlchemyProvider } = ethers.providers;


/**
 * SETUP
 */
const networkName = network.name === 'hardhat' ? 'mainnet' : network.name;
 
var activeMonitoring;
var provider, socket, auctionHouse, nounsSeeder, flashbotSigner, flashbotsProvider;

async function assignNetworkParams() {
  provider = ethers.provider; // new ethers.providers.AlchemyProvider(network, key);

  // Fake the socket with a provider if using a Hardhat mainnet fork
  socket = network.name === 'hardhat' ? provider : new AlchemyProvider.getWebSocketProvider(networkName, provider.key);

  auctionHouse = new ethers.Contract(address.auctionHouseProxy[networkName], abi.auctionHouseProxy, provider);
  nounsSeeder = new ethers.Contract(address.nounsSeeder[networkName], abi.nounsSeeder, provider);

  flashbotSigner = Wallet.createRandom(); // TODO: Assing a stable private key new Wallet(<private key>)
  flashbotsProvider =
    // (network.name === 'mainnet') ? FlashbotsBundleProvider.create(provider, flashbotSigner) :
    // (network.name === 'goerli')  ? FlashbotsBundleProvider.create(provider, flashbotSigner, 'https://relay-goerli.flashbots.net/', 'goerli') :
    null;
}



/**
 * NOUN EVALUATION:
 *   Check if Noun is appealing enough to mint
 */
function logNoun(nounSeed) {
  let head = nounSeed.head.toString();
  let body = nounSeed.body.toString();
  let accessory = nounSeed.accessory.toString();
  let glasses = nounSeed.glasses.toString();
  let background = nounSeed.background.toString();

  console.log(`👓 Noun: head ${head}  body ${body}  accessory ${accessory}  glasses ${glasses}  bg ${background}`);
}

function isDesirableNoun(nounSeed) {
  if (nounSeed.head === 187) {
    console.log(`🦈🦈🦈: SHARK FOUND, SETTLING...`);
    return true;
  } else {
    return false;
  }
}



/**
 * HELPER FUNCTIONS:
 *   Simple functions used 
 */
const nowSeconds = () => Math.floor(Date.now() / 1000);

function pauseFor(seconds) {
  new Promise(r => {
    activeMonitoring = false;
    console.log(`😴 Sleeping at ${nowSeconds()} for ${seconds}s`);
    setTimeout(r, seconds * 1000);
  }).then(() => {
    activeMonitoring = true;
    console.log(`⏰ Awoke at ${nowSeconds()}, monitoring...`);
  });
}



/**
 * RETRIEVE DATA FOR AUCTION & NOUNS
 */
async function getNounSeed(nextNounId) {
  return nounsSeeder.generateSeed(nextNounId, address.nounsDescriptor[networkName]);
}

async function getAuction() {
  return auctionHouse.auction();
}

async function getData(nextNounId) {
  const auctionPromise = await getAuction();
  const nextNounPromise = await getNounSeed(nextNounId);
  return Promise.all([auctionPromise, nextNounPromise]).then(values => {
    return {auction: values[0], nextNoun: values[1]};
  });
}



/**
 * MAIN LOOP
 */
async function main() {
  await assignNetworkParams();

  console.log(`🤖 Launching monitoring on ${network.name}...`);
  activeMonitoring = true;

  [signer] = await ethers.getSigners();
  var nextNounId = (await auctionHouse.auction()).nounId.add(1);

  socket.on('block', async (blockNumber) => {
    if (!activeMonitoring) return;

    console.log(`🧱 Block: ${blockNumber} [${nowSeconds()}s]`);

    const {auction, nextNoun} = await getData(nextNounId);
    const time = nowSeconds();

    if (auction.nounId < nextNounId && auction.endTime < time && !auction.settled) {
      logNoun(nextNoun);
      if (isDesirableNoun(nextNoun)) {
        // settleFlashbots(auctionHouse, flashbotsProvider, signer, blockNumber+1);
        settleNormally(auctionHouse, provider, signer, blockNumber+1);
      }
    } else {
      if (auction.nounId >= nextNounId) {
        nextNounId = auction.nounId+1;
        console.log(`🍍 Fresh Noun ${auction.nounId} minted`);
      }
  
      if (auction.endTime > time) {
        pauseFor(auction.endTime - nowSeconds() - 5);
      }
    }
  });
}
main();