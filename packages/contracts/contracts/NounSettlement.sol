// SPDX-License-Identifier: GPL-3.0

/// @title FOMO Nouns Settlement Contract
/// @author forager

pragma solidity 0.8.9;

import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';

import "hardhat/console.sol"; // TODO: Remove before deployment

contract NounSettlement {
  address payable public nounsDao;
  address payable public fomoExecutor;
  INounsAuctionHouse public immutable auctionHouse;

  uint256 public maxPriorityFee;
  uint256 private OVERHEAD_GAS = 21000; // Handles gas outside gasleft checks, rounded up from ~20,257 in testing


  constructor(address _fomoExecutor, address _nounsDao, address _nounsAuctionHouseAddress) {
    auctionHouse = INounsAuctionHouse(_nounsAuctionHouseAddress);
    fomoExecutor = payable(_fomoExecutor);
    nounsDao = payable(_nounsDao);

    maxPriorityFee = 100 * 10**9; // Prevents malicious actor burning all the ETH on gas
  }


  /**
    Custom modifiers to handle access and refund
   */
  modifier onlyDAO() {
    require(msg.sender == nounsDao, "Only executable by Nouns DAO");
    _;
  }

  modifier onlyFOMO() {
    require(msg.sender == fomoExecutor, "Only executable by FOMO Nouns executor");
    _;
  }

  modifier refundGas() { // Executor must be EOA
    uint256 startGas = gasleft();
    require(tx.gasprice <= block.basefee + maxPriorityFee, "Gas price above current reasonable limit");
    _;
    uint256 endGas = gasleft();

    uint256 totalGasCost = tx.gasprice * (startGas - endGas + OVERHEAD_GAS);
    console.log("Gas Used %s", startGas - endGas); // TODO: Remove before deployment
    fomoExecutor.transfer(totalGasCost);
  }


  /**
    Fund management to allow donations and liquidation by the DAO
   */
  function donateFunds() external payable { }
  receive() external payable { }
  fallback() external payable { }

  function pullFunds() external onlyDAO {
    (bool sent, ) = nounsDao.call{value: address(this).balance}("");
    require(sent, "Funds removal failed.");
  }


  /**
    Change addresses or limits for the contract exeuction
   */
  function changeDaoAddress(address _newDao) external onlyDAO {
    nounsDao = payable(_newDao);
  }

  function changeExecutorAddress(address _newFomoExecutor) external onlyDAO {
    fomoExecutor = payable(_newFomoExecutor);
  }

  function changeMaxPriorityFee(uint256 _newMaxPriorityFee) external onlyDAO {
    maxPriorityFee = _newMaxPriorityFee;
  }


  /**
    Mint the desired Nouns via Flashbots
   */
  function settleAuction(bytes32 _desiredHash) public {
    bytes32 lastHash = blockhash(block.number - 1); // Only settle if desired Noun would be minted
    require(lastHash == _desiredHash, "Prior blockhash did not match intended hash");
    
    auctionHouse.settleCurrentAndCreateNewAuction();
  }

  function settleAuctionWithRefund(bytes32 _desiredHash) external refundGas onlyFOMO {
    settleAuction(_desiredHash);
  }
}