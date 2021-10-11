// SPDX-License-Identifier: GPL-3.0

/// @title FOMO Nouns Settlement Contract
/// @author forager

pragma solidity 0.8.9;

import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';
import { AccessControl } from '@openzeppelin/contracts/access/AccessControl.sol';


contract NounSettlement is AccessControl {
  address payable public nounsDao;
  address payable public executor;
  INounsAuctionHouse public immutable auctionHouse;

  uint256 public maxGasPrice;
  uint256 private OVERHEAD_GAS = 28925;


  constructor(address _executor, address _nounsDao, address _nounsAuctionHouseAddress) {
    auctionHouse = INounsAuctionHouse(_nounsAuctionHouseAddress);
    executor = payable(_executor);
    nounsDao = payable(_nounsDao);

    maxGasPrice = 1000 * 10**9; // 1,000 gwei; used to limit damage from malicious executor
  }

  /**
    Custom modifiers to limit executor to intended addresses
   */
  modifier onlyDAO() {
    require(msg.sender == nounsDao, "Only executable by Nouns DAO");
    _;
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

  function changeExecutorAddress(address _newExecutor) external onlyDAO {
    executor = payable(_newExecutor);
  }

  function changeMaxGasPrice(uint256 _newGasPriceLimit) external onlyDAO {
    maxGasPrice = _newGasPriceLimit;
  }


  /**
    Mint the desired Nouns via Flashbots
   */
  function mintDesiredNoun(bytes32 _desiredHash) external {
    uint256 startGas = gasleft();

    require(msg.sender == executor, "Only executable by FOMO Nouns executor");

    // Settle the auction only if blockhash matches the intended hash
    bytes32 lastHash = blockhash(block.number - 1);
    require(lastHash == _desiredHash, "Prior blockhash did not match intended hash");

    (bool success, ) = address(auctionHouse).call(abi.encodeWithSignature("settleCurrentAndCreateNewAuction()"));
    require(success, "Settlement failed");

    // Reimburse the gas used plus a reasonable overhead for require, transfer, calculations
    require(tx.gasprice <= maxGasPrice, "Gas price above current reasonable limit");

    uint256 totalGasCost = tx.gasprice * (OVERHEAD_GAS + startGas - gasleft());
    executor.transfer(totalGasCost); // Executor must be EOA
  }
}