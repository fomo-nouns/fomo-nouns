const { expect } = require('chai');
const { ethers } = require('hardhat');
const { abi } = require('../scripts/config.js');

const {
  networkReset,
  impersonateAccount,
  setEtherBalance
} = require('./utils.js');


/**
 * Run Test Suite
 */
describe("NounSettlement", function () {
  const NOUNS_TREASURY = '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10'; // Rinkeby: 0xF598635a5892AB8a363e1222C6aEB798AEDF8a84
  const FOMO_MULTISIG = '0x54D84e89B5fCc4D54a2123e050263F29AA176DA3'; // Rinkeby: 0x63F9074555023e5aBcDeaD029DF4B012414Ac9Cb
  const AUCTION_PROXY_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';

  var executor, multisig, auctionHouse, random1, random2;
  var settler;


  /**
   * Setup: Deploy contract 
   */
  before("Setup signers", async function() {
    [executor, /*deployer*/, random1, random2] = await ethers.getSigners();

    multisig = ethers.provider.getSigner(FOMO_MULTISIG);

    auctionHouse = await ethers.getContractAt(abi.auctionHouseProxy, AUCTION_PROXY_ADDRESS);
  });

  beforeEach("Deploy settlement contract", async function() {
    await networkReset(13854828); // One block prior to Noun 148 settlement at Dec-22-2021 11:49:07 AM +UTC
    
    const Settler = await ethers.getContractFactory('NounSettlement', executor);
    settler = await Settler.deploy(executor.address, NOUNS_TREASURY, AUCTION_PROXY_ADDRESS, FOMO_MULTISIG);
    await settler.deployed();

    await setEtherBalance(settler.address, 21);
    await setEtherBalance(FOMO_MULTISIG, 21);
  });


  /**
   * Ownable: 
   */
  describe("Address Management", async function() {

    describe("Executor", async function() {
      it("Should return the initialized Executor address", async function() {
        expect(await settler.fomoExecutor()).to.equal(executor.address);
      });

      it("Should allow the Executor address to be changed by the Multisig", async function() {
        await impersonateAccount(FOMO_MULTISIG);
        await settler.connect(multisig).changeExecutorAddress(random1.address);

        expect(await settler.fomoExecutor()).to.equal(random1.address);
      });
  
      it("Should prevent others from changing the Executor address", async function() {
        expect( settler.connect(random1).changeExecutorAddress(random1.address) ).to.be.reverted;

        expect( settler.connect(executor).changeExecutorAddress(executor.address) ).to.be.reverted;
      });
    });

    describe("Nouns DAO & Multisig", async function() {
      it("Should return the initialized Multisig address", async function() {
        expect(await settler.fomoMultisig()).to.equal(FOMO_MULTISIG);
      });

      it("Should return the initialized Nouns DAO Treasury address", async function() {
        expect(await settler.nounsDaoTreasury()).to.equal(NOUNS_TREASURY);
      });
    });
  });

  describe("Funds Management", async function() {
    describe("Deposit", async function() {
      it("Should allow ETH deposits via deposit()", async function() {
        let amt = ethers.utils.parseEther('1');

        let startBalance = await ethers.provider.getBalance(settler.address);
        await settler.connect(random1).donateFunds({value: amt});
        let endBalance = await ethers.provider.getBalance(settler.address);

        expect(endBalance).to.equal(startBalance.add(amt));
      });

      it("Should allow ETH deposits via fallback", async function() {
        let amt = ethers.utils.parseEther('1');

        let startBalance = await ethers.provider.getBalance(settler.address);
        await random1.sendTransaction({to: settler.address, value: amt});
        let endBalance = await ethers.provider.getBalance(settler.address);

        expect(endBalance).to.equal(startBalance.add(amt));
      });
    });

    describe("Withdrawls", async function() {
      it("Should allow the Multisig to withdraw all funds", async function() {
        let contractStartBalance = await ethers.provider.getBalance(settler.address);
        let daoStartBalance = await ethers.provider.getBalance(NOUNS_TREASURY);
        let multisigStartBalance = await ethers.provider.getBalance(FOMO_MULTISIG);

        await impersonateAccount(FOMO_MULTISIG);
        
        const tx = await settler.connect(multisig).pullFunds();
        const rcp = await tx.wait();
        const gasEth = rcp.gasUsed.mul(tx.gasPrice);

        let contractEndBalance = await ethers.provider.getBalance(settler.address);
        let daoEndBalance = await ethers.provider.getBalance(NOUNS_TREASURY);
        let multisigEndBalance = await ethers.provider.getBalance(FOMO_MULTISIG);

        expect(daoEndBalance).to.equal(daoStartBalance.add(contractStartBalance));
        expect(multisigEndBalance).to.equal(multisigStartBalance.sub(gasEth));
        expect(contractEndBalance).to.equal(0);
      });

      it("Should prevent anyone else from withdrawing funds", async function() {
        expect( settler.connect(executor).pullFunds() ).to.be.reverted;
        expect( settler.connect(random1).pullFunds() ).to.be.reverted;
      });
    });
  });

  describe("Settlement", async function() {
    describe("Basic Settlement", async function() {
      it("Should let anyone settle auction with proper blockhash", async function() {
        const lastAuction = await auctionHouse.auction();

        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);
        await settler.connect(random1).settleAuction(lastHash.hash);

        const newAuction = await auctionHouse.auction();

        expect(newAuction.nounId).to.equal(lastAuction.nounId.add(1));
        expect(newAuction.settled).to.be.false;
      });

      it("Should revert if blockhash does not match", async function() {
        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock-3);

        expect( settler.connect(random1).settleAuction(lastHash.hash) ).to.be.reverted;
      });
    });

    describe("Refunds", async function() {
      it("Should refund the amount needed in gas", async function() {
        let startBalance = await ethers.provider.getBalance(executor.address);

        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);
        
        const tx = await settler.connect(executor).settleAuctionWithRefund(lastHash.hash);
        const rcp = await tx.wait();
        const gasEth = rcp.gasUsed.mul(tx.gasPrice);

        let endBalance = await ethers.provider.getBalance(executor.address);

        const tolerance = ethers.utils.parseEther('0.001');

        // Goal is a non-negative but very small value
        expect( endBalance.sub(startBalance).abs().lt(tolerance) ).to.be.true;
        expect( endBalance.sub(startBalance).gte(0) ).to.be.true;
      });

      it("Should not refund failed transactions", async function() {
        // Settle auction directly to simulate invalid transaction
        await auctionHouse.connect(executor).settleCurrentAndCreateNewAuction();

        const startAcctBalance = await ethers.provider.getBalance(executor.address);
        const startContractBalance = await ethers.provider.getBalance(settler.address);

        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);
        await expect( settler.connect(executor).settleAuctionWithRefund(lastHash.hash) ).to.be.reverted;

        const endAcctBalance = await ethers.provider.getBalance(executor.address);
        const endContractBalance = await ethers.provider.getBalance(settler.address);

        expect(endAcctBalance.lt(startAcctBalance)).to.be.true;
        expect(startContractBalance).to.equal(endContractBalance);
      });

      it("Should not let random users call this", async function() {
        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);

        expect(
          settler.connect(random1).settleAuctionWithRefund(lastHash.hash)
        ).to.be.revertedWith("Only callable by FOMO Nouns executor");
      });

      it("Should not allow excessively high gas (Pre-1559)", async function() {
        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);

        expect(
          settler.connect(executor).settleAuctionWithRefund(lastHash.hash, {
            gasPrice: ethers.utils.parseUnits('1000', 'gwei')
          })
        ).to.be.revertedWith("Gas price above current reasonable limit");
      });

      it("Should allow a high max fee that is not used (Post-1559)", async function() {
        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);

        settler.connect(executor).settleAuctionWithRefund(lastHash.hash, {
          maxFeePerGas: ethers.utils.parseUnits('1000', 'gwei')
        })
        
        // Auction should be settled
        const newAuction = await auctionHouse.auction();
        expect(newAuction.settled).to.be.false;
      });

      it("Should not allow excessively high priority fee (Post-1559)", async function() {
        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);

        expect(
          settler.connect(executor).settleAuctionWithRefund(lastHash.hash, {
            maxPriorityFeePerGas: ethers.utils.parseUnits('1000', 'gwei')
          })
        ).to.be.revertedWith("Gas price above current reasonable limit");
      });
    });
  });

});
