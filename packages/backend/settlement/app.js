const { settleNormally } = require('../../settlement/settle.js');

const { ethers } = require('ethers');
const nowSeconds = () => Math.floor(Date.now() / 1000);


/**
 * SETUP
 */
const privateKey = process.env.FOMO_EXECUTOR_PRIVATE_KEY; // Provided by environment locally or on Lambda
const networkName = 'rinkeby';
const auctionHouseAddress = '0x7cb0384b923280269b3BD85f0a7fEaB776588382';

const provider = new ethers.providers.AlchemyProvider(networkName, key);
const auctionHouse = new ethers.Contract(auctionHouseAddress, abi.auctionHouseProxy, provider);

async function getAuction() {
  return auctionHouse.auction();
}


/**
 * 
 */
exports.handler = async (event) => {
  const lastRecord = event.Records[event.Records.length-1];
  const newVotes = lastRecord.dynamodb.NewImage;
  
  if (newVotes.voteLove.N < newVotes.totalConnected.N) {
    return {
      statusCode: 200,
      body: JSON.stringify('Votes insufficient for settlement'),
    };
  }

  const pk = lastRecord.dynamodb.NewImage.pk.S;
  const [nextNounId, , blockhash] = pk.split('|');
  
  const auction = await getAuction();
  const time = nowSeconds();

  if (auction.nounId < nextNounId && auction.endTime < time && !auction.settled) {
    const signer = new ethers.Wallet(privateKey, provider);

    settleNormally(auctionHouse, provider, signer, blockNumber+1);

    return {
      statusCode: 200,
      body: JSON.stringify('Settlement complete'),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify('Auction ineligible for settlement'),
  }
};