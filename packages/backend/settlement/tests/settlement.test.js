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

  const NETWORK_NAME = 'mainnet';
  const FOMO_EXECUTOR_ADDRESS = '0x85906cF629ae1DA297548769ecE3e3E6a4f3288f';
  const AUCTION_PROXY_ADDRESS = '0x830BD73E4184ceF73443C15111a1DF14e495C706';
  const FOMO_SETTLER_ADDRESS = '0xb2341612271e122ff20905c9e389c3d7f0F222a1';
  
  // https://etherscan.io/tx/0x41e1d69761ab00167384c3871f0e5d6c6d8a2d85a35ffab29d0b170d81888165
  const RESET_BLOCK_NUMBER = 16890723;
  const SETTLEMENT_NOUN_ID = 653n;

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

      const block = await executor.provider.getBlock();
      const blockhash = block.hash;

      impersonateAccount(FOMO_EXECUTOR_ADDRESS);
      let result = await submitSettlement(executor, SETTLEMENT_NOUN_ID, blockhash, FOMO_SETTLER_ADDRESS);
      expect(result).to.be.true;
    });

    it("should revert for a live auction", async function() {
      await networkReset(RESET_BLOCK_NUMBER+1, NETWORK_NAME); // One block AFTER

      const block = await executor.provider.getBlock();
      const blockhash = block.hash;

      impersonateAccount(FOMO_EXECUTOR_ADDRESS);
      let result = await submitSettlement(executor, SETTLEMENT_NOUN_ID, blockhash, FOMO_SETTLER_ADDRESS);

      expect(result).to.be.false;
    });

    it("should revert if block is too old", async function() {
      await networkReset(RESET_BLOCK_NUMBER, NETWORK_NAME);

      const block = await executor.provider.getBlock(RESET_BLOCK_NUMBER-1); // One block BEFORE
      const blockhash = block.hash;

      impersonateAccount(FOMO_EXECUTOR_ADDRESS);
      let result = await submitSettlement(executor, SETTLEMENT_NOUN_ID, blockhash, FOMO_SETTLER_ADDRESS);

      expect(result).to.be.false;
    });
  });

});
