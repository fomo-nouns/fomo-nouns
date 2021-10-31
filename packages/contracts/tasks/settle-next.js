const { abi, address } = require('../scripts/config.js');
const { task, types } = require('hardhat/config');

task('settle-next', 'Attempts settlement for the next Noun')
  .addParam('settler', 'Address for the NounSettlement contract')
  .setAction(async ({ settler }, { network, ethers }) => {
    const [signer] = await ethers.getSigners();
    const provider = ethers.provider;
    const socket = new ethers.providers.AlchemyWebSocketProvider(network.name); // new ethers.providers.AlchemyProvider.getWebSocketProvider(network.name, process.env.ALCHEMY_RINKEBY_KEY);
    
    const settlerFactory = await ethers.getContractFactory('NounSettlement', signer);
    const settlerContract = settlerFactory.attach(settler);

    await new Promise(function(resolve, reject) {
      socket.once('block', async (blockNumber) => {
        console.log(`Attempting ${network.name} settlement on ${blockNumber+1} with ${signer.address}...`);

        const block = await provider.getBlock(blockNumber);
        const blockhash = block.hash;

        const trxn = await settlerContract.settleAuction(blockhash);
        const receipt = await trxn.wait();

        if (receipt.status) {
          console.log(`... settlement mined on ${trxn.blockNumber}`);
        } else {
          console.log('... settlement transaction REVERTED');
        }
        resolve();
      });
    });

    console.log('Task complete.');
  });
