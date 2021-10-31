const { abi, address } = require('../scripts/config.js');

/**
 * Settle the Current Auction
 */
task("settle-auction", "Settle the current auction and starts new auction", async (taskArgs, hre) => {
  const network = hre.network.name;
  const [signer] = await hre.ethers.getSigners();

  console.log(`Settling auction on ${network} with ${await signer.getAddress()}`);
  const auctionHouse = new hre.ethers.Contract(address.auctionHouseProxy[network], abi.auctionHouseProxy, signer);
  
  const tx = await auctionHouse.settleCurrentAndCreateNewAuction();
  await tx.wait();

  console.log('Auction settled.');
});