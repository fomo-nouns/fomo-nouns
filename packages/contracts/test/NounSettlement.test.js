const { expect } = require('chai');
const { ethers } = require('hardhat');
const { abi } = require('../scripts/config.js');

const {
  networkReset,
  impersonateAccount,
  setEtherBalance,
  etherBalance
} = require('./utils.js');


/**
 * Run Test Suite
 */
describe("NounSettlement", function () {
  const NOUNS_DAO_ADDRESS = '0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e'; // TODO: Replace with real DAO with proper proposal execution
  const AUCTION_PROXY_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';

  var executor, nounsDao, auctionHouse, random1, random2;
  var settler;


  /**
   * Setup: Deploy contract 
   */
  before("Setup signers", async function() {
    [executor, random1, random2] = await ethers.getSigners();

    nounsDao = ethers.provider.getSigner(NOUNS_DAO_ADDRESS);

    auctionHouse = await ethers.getContractAt(abi.auctionHouseProxy, AUCTION_PROXY_ADDRESS);
  });

  beforeEach("Deploy settlement contract", async function() {
    await networkReset(13287091); // One block prior to Noun 51 settlement at Sep-24-2021 07:14:39 AM +UTC
    
    const Settler = await ethers.getContractFactory('NounSettlement', executor);
    settler = await Settler.deploy(executor.address, NOUNS_DAO_ADDRESS, AUCTION_PROXY_ADDRESS);
    await settler.deployed();

    await setEtherBalance(settler.address, 21);
  });


  /**
   * Ownable: 
   */
  describe("Address Management", async function() {

    describe("Executor", async function() {
      it("Should return the initialized Executor address", async function() {
        expect(await settler.executor()).to.equal(executor.address);
      });

      it("Should allow the Executor address to be changed by the DAO", async function() {
        await impersonateAccount(NOUNS_DAO_ADDRESS);
        await settler.connect(nounsDao).changeExecutorAddress(random1.address);

        expect(await settler.executor()).to.equal(random1.address);
      });
  
      it("Should prevent others from changing the Executor address", async function() {
        expect( settler.connect(random1).changeExecutorAddress(random1.address) ).to.be.reverted;

        expect( settler.connect(executor).changeExecutorAddress(executor.address) ).to.be.reverted;
      });
    });

    describe("DAO", async function() {
      it("Should return the initialized DAO address", async function() {
        expect(await settler.nounsDao()).to.equal(NOUNS_DAO_ADDRESS);
      });

      it("Should allow the DAO address to be changed by the DAO", async function() {
        await impersonateAccount(NOUNS_DAO_ADDRESS);
        await settler.connect(nounsDao).changeDaoAddress(random1.address);

        expect(await settler.nounsDao()).to.equal(random1.address);
      });
  
      it("Should prevent others from changing the DAO address", async function() {
        expect( settler.connect(random1).changeDaoAddress(random1.address) ).to.be.reverted;

        expect( settler.connect(executor).changeDaoAddress(executor.address) ).to.be.reverted;
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
      it("Should allow the DAO to withdraw all funds", async function() {
        let contractStartBalance = await ethers.provider.getBalance(settler.address);
        let daoStartBalance = await ethers.provider.getBalance(NOUNS_DAO_ADDRESS);

        await impersonateAccount(NOUNS_DAO_ADDRESS);
        
        const tx = await settler.connect(nounsDao).pullFunds();
        const rcp = await tx.wait();
        const gasEth = rcp.gasUsed.mul(tx.gasPrice);

        let contractEndBalance = await ethers.provider.getBalance(settler.address);
        let daoEndBalance = await ethers.provider.getBalance(NOUNS_DAO_ADDRESS);

        expect(daoEndBalance).to.equal(daoStartBalance.add(contractStartBalance).sub(gasEth));
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

        const tolerance = ethers.utils.parseEther('0.0001');

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
        ).to.be.revertedWith("Only executable by FOMO Nouns executor");
      });

      it("Should not allow excessively high gas", async function() {
        const lastBlock = await ethers.provider.getBlockNumber();
        const lastHash = await ethers.provider.getBlock(lastBlock);

        expect(
          settler.connect(executor).settleAuctionWithRefund(lastHash.hash, {
            gasPrice: ethers.utils.parseUnits('1000', 'gwei')
          })
        ).to.be.revertedWith("Gas price above current reasonable limit");
      });
    });
  });

});
