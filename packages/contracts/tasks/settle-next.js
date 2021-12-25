const { task } = require('hardhat/config');
const prompt = require('prompt');

task('settle-next', 'Attempts settlement for the next Noun')
  .addParam('settler', 'Address for the NounSettlement contract')
  .addFlag('refund', 'Toggles calling refundable settlement')
  .addOptionalParam('priorityFee', 'Priority gas fee to use (in gwei)', '10')
  .setAction(async ({ settler, refund, priorityFee }, { network, ethers }) => {
    const [signer] = await ethers.getSigners();
    const provider = ethers.provider;
    const socket = new ethers.providers.AlchemyWebSocketProvider(network.name);
    
    const settlerFactory = await ethers.getContractFactory('NounSettlement', signer);
    const settlerContract = settlerFactory.attach(settler);

    const startBalance = await provider.getBalance(signer.address);
    const priorityFeeWei = ethers.utils.parseUnits(priorityFee, 'gwei');

    await new Promise(function(resolve, reject) {
      socket.once('block', async (blockNumber) => {
        console.log(`Attempting ${network.name} settlement on ${blockNumber+1} with ${signer.address}...`);

        const feeData = await provider.getFeeData();
        const block = await provider.getBlock(blockNumber);
        const blockhash = block.hash;        

        const gas = {
          maxFeePerGas: feeData.maxFeePerGas.add(priorityFeeWei),
          maxPriorityFeePerGas: priorityFeeWei
        };

        const trxn = await (refund ? settlerContract.settleAuctionWithRefund(blockhash, gas) : settlerContract.settleAuction(blockhash, gas));
        const receipt = await trxn.wait();
        console.log(trxn);
        console.log(receipt);

        if (receipt.status) {
          console.log(`... settlement mined on ${trxn.blockNumber}`);
        } else {
          console.log('... settlement transaction REVERTED');
        }
        resolve();
      });
    });

    const endBalance = await provider.getBalance(signer.address);

    console.log(`Signer ETH Balance Change: ${ethers.utils.formatEther(startBalance.sub(endBalance))}`)

    console.log('Task complete.');
  });
