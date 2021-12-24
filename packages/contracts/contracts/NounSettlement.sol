// SPDX-License-Identifier: GPL-3.0

/// @title FOMO Nouns Settlement Contract
/// @author forager

pragma solidity 0.8.9;

import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';

import "hardhat/console.sol"; // TODO: Remove before deployment

contract NounSettlement {
  address payable public immutable nounsDaoTreasury;
  address payable public fomoExecutor;
  address public immutable fomoMultisig;
  INounsAuctionHouse public immutable auctionHouse;

  uint256 public maxPriorityFee = 40 * 10**9; // Prevents malicious actor burning all the ETH on gas
  uint256 private immutable OVERHEAD_GAS = 21000; // Handles gas outside gasleft checks, rounded up from ~20,257 in testing


  constructor(address _fomoExecutor, address _nounsDaoTreasury, address _nounsAuctionHouseAddress, address _fomoMultisig) {
    auctionHouse = INounsAuctionHouse(_nounsAuctionHouseAddress);
    fomoExecutor = payable(_fomoExecutor);
    fomoMultisig = _fomoMultisig;
    nounsDaoTreasury = payable(_nounsDaoTreasury);
  }


  /**
    Custom modifiers to handle access and refund
   */
  modifier onlyMultisig() {
    require(msg.sender == fomoMultisig, "Only executable by FOMO Multsig");
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

  function pullFunds() external onlyMultisig {
    (bool sent, ) = nounsDaoTreasury.call{value: address(this).balance}("");
    require(sent, "Funds removal failed.");
  }


  /**
    Change addresses or limits for the contract exeuction
   */
  function changeExecutorAddress(address _newFomoExecutor) external onlyMultisig {
    fomoExecutor = payable(_newFomoExecutor);
  }

  function changeMaxPriorityFee(uint256 _newMaxPriorityFee) external onlyMultisig {
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