const { expect } = require('chai');
const { ethers } = require('hardhat');

const { networkReset, impersonateAccount } = require('./utils.js');
const { submitSettlement } = require('../utils/settlement');
const { FOMO_SETTLER_ABI, AUCTION_HOUSE_ABI } = require('../utils/abi');


/**
 * Run Test Suite
 */
describe("Settlement", function () {
  this.timeout(20 * 1e3); 

  const NETWORK_NAME = 'rinkeby';
  const FOMO_EXECUTOR_ADDRESS = '0xf49478bbbb27cc7a5e17d42588960195d127338b';
  const AUCTION_PROXY_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';
  const FOMO_SETTLER_ADDRESS = '0xFa7C3ab143074BcbF09db8450810d78E4B9b19a3';
  
  // One block prior to Noun 849 settlement at Oct-31-2021 09:34:54 PM +UTC
  const RESET_BLOCK_NUMBER = 9563715;

  var executor, auctionHouse;
  var settler;


  /**
   * Setup
   */
  before("Setup signers", async function() {
    executor = await ethers.provider.getSigner(FOMO_EXECUTOR_ADDRESS);

    settler = await ethers.getContractAt(FOMO_SETTLER_ABI, FOMO_SETTLER_ADDRESS);
    auctionHouse = await ethers.getContractAt(AUCTION_HOUSE_ABI, AUCTION_PROXY_ADDRESS);
  });


  /**
   * Tests
   */
  describe("Successful Test", async function() {
    it("should settle a pending auction", async function() {
      await networkReset(RESET_BLOCK_NUMBER, NETWORK_NAME);

      const block = await executor.provider.getBlock(RESET_BLOCK_NUMBER);
      const blockhash = block.hash;

      impersonateAccount(FOMO_EXECUTOR_ADDRESS);
      let result = await submitSettlement(executor, blockhash, FOMO_SETTLER_ADDRESS);
      expect(result).to.be.true;
    });

    it("should revert for a live auction", async function() {
      await networkReset(RESET_BLOCK_NUMBER+1, NETWORK_NAME); // One block AFTER

      const block = await executor.provider.getBlock(RESET_BLOCK_NUMBER);
      const blockhash = block.hash;

      impersonateAccount(FOMO_EXECUTOR_ADDRESS);
      let result = await submitSettlement(executor, blockhash, FOMO_SETTLER_ADDRESS);

      expect(result).to.throw;
    });
  });

});
