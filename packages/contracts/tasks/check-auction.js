const { abi, address } = require('../scripts/config.js');

/**
 * Check the Status of the Nouns Auction
 */
task("check-auction", "Checks the status of the current auction", async (taskArgs, hre) => {
  const network = hre.network.name;
  const alchemy = hre.ethers.provider;

  const auctionHouse = new hre.ethers.Contract(address.auctionHouseProxy[network], abi.auctionHouseProxy, alchemy);
  const currentAuction = await auctionHouse.auction();

  let curSeconds = Math.floor(Date.now() / 1000);

  console.log(`
    NounID: ${currentAuction.nounId.toString()}
    
    Current Bid: ${hre.ethers.utils.formatEther(currentAuction.amount)}
    Top Bidder: ${currentAuction.bidder}

    Time Left: ${Math.max(0,currentAuction.endTime.toNumber() - curSeconds)}
      - Curr Time: ${curSeconds}
      - End Time: ${currentAuction.endTime.toString()}

    Auction Over? ${currentAuction.endTime < curSeconds}
    Settled?  ${currentAuction.settled}
  `);
});