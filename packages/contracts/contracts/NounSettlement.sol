// SPDX-License-Identifier: GPL-3.0

/// @title FOMO Nouns Settlement Contract
/// @author forager

pragma solidity ^0.8.6;

import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';
import { AccessControl } from '@openzeppelin/contracts/access/AccessControl.sol';


contract NounSettlement is AccessControl {
  address private immutable executor;
  address private immutable nounsDao;
  INounsAuctionHouse private immutable auctionHouse;

  bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
  bytes32 public constant FOMO_ROLE = keccak256("FOMO_ROLE");
  

  constructor(address _executor, address _nounsDao, address _nounsAuctionHouseAddress) {
    executor = _executor;
    nounsDao = _nounsDao;
    auctionHouse = INounsAuctionHouse(_nounsAuctionHouseAddress);

    _setupRole(DAO_ROLE, _nounsDao);
    _setupRole(FOMO_ROLE, _executor);
    _setRoleAdmin(DAO_ROLE, DAO_ROLE); // All DAO_ROLE members have admin rights
  }

  function donateFunds() external payable { }

  function pullFunds() external onlyRole(DAO_ROLE) {
    (bool sent, ) = payable(nounsDao).call{value: address(this).balance}("");
    require(sent, "Funds removal failed.");
  }

  function changeDaoAddress(address _newDao) external onlyRole(DAO_ROLE) {
    grantRole(DAO_ROLE, _newDao);
    renounceRole(DAO_ROLE, address(this));
  }


  /**
    Mint the desired Nouns via Flashbots
   */
  function mintDesiredNoun(bytes32 _desiredHash, uint256 _minerEthTip) external onlyRole(FOMO_ROLE) {
    bytes32 lastHash = blockhash(block.number - 1);
    require(_desiredHash == lastHash, "Block hashes do not match, not settling");

    (bool success, ) = address(auctionHouse).call(abi.encodeWithSignature("settleCurrentAndCreateNewAuction()"));
    require(success, "Settlement failed");
    
    block.coinbase.transfer(_minerEthTip);
  }

  receive() external payable { }
  fallback() external payable { }
}