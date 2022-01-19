import 'package:mobileapp/nouns_sdk/src/contract/types.dart';

class ContractAddress implements ContractAddresses {
  @override
  String? nftDescriptor;

  @override
  String? nounsAuctionHouse;

  @override
  String? nounsAuctionHouseProxy;

  @override
  String? nounsAuctionHouseProxyAdmin;

  @override
  String? nounsDAOLogicV1;

  @override
  String? nounsDAOProxy;

  @override
  String? nounsDaoExecutor;

  @override
  String? nounsDescriptor;

  @override
  String? nounsSeeder;

  @override
  String? nounsToken;

  ContractAddress(int chainId) {
    // TODO: add Rinkeby and Local
    if (chainId == ChainId.mainnet) {
      nounsToken = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';
      nounsSeeder = '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515';
      nounsDescriptor = '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63';
      nftDescriptor = '0x0BBAd8c947210ab6284699605ce2a61780958264';
      nounsAuctionHouse = '0xF15a943787014461d94da08aD4040f79Cd7c124e';
      nounsAuctionHouseProxy = '0x830BD73E4184ceF73443C15111a1DF14e495C706';
      nounsAuctionHouseProxyAdmin =
          '0xC1C119932d78aB9080862C5fcb964029f086401e';
      nounsDaoExecutor = '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10';
      nounsDAOProxy = '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d';
      nounsDAOLogicV1 = '0xa43aFE317985726E4e194eb061Af77fbCb43F944';
    } else {
      throw Exception(
          "No known contracts have been deployed on the chain with the id: $ChainId.");
    }
  }
}
