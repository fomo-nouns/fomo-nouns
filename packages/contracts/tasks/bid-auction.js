const { abi, address } = require('../scripts/config.js');

/**
 * Bid on Current Auction
 */
task("bid-auction", "Bid on the current Noun auction")
  .addParam("bid", "ETH amount to bid on the Noun")
  .addParam("noun", "ID of the Noun to place a bid on")
  .setAction(async (taskArgs, hre) => {
    const network = hre.network.name;
    const ethBidAmount = taskArgs.bid;
    const nounId = taskArgs.noun;
    
    if (!ethBidAmount || !nounId) {
      if (!ethBidAmount) console.log('No bid amount specified. Terminating bid...');
      if (!nounId) console.log('No noun ID specified. Terminating bid...');
      return;
    }

    const [signer] = await hre.ethers.getSigners();
    console.log(`Bidding ${ethBidAmount} ETH on ${network} with ${await signer.getAddress()}`);
    const auctionHouse = new hre.ethers.Contract(address.auctionHouseProxy[network], abi.auctionHouseProxy, signer);

    const weiBidAmount = hre.ethers.utils.parseEther(ethBidAmount);
    console.log(`   - bid in wei ${weiBidAmount}`);
    
    const tx = await auctionHouse.createBid(nounId, {value: weiBidAmount});
    await tx.wait();

    console.log('Bid submitted.');
  });