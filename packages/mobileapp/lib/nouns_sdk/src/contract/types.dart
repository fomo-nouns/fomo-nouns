abstract class ContractAddresses {
  String? nounsToken;

  String? nounsSeeder;

  String? nounsDescriptor;

  String? nftDescriptor;

  String? nounsAuctionHouse;

  String? nounsAuctionHouseProxy;

  String? nounsAuctionHouseProxyAdmin;

  String? nounsDaoExecutor;

  String? nounsDAOProxy;

  String? nounsDAOLogicV1;
}

class ChainId {
  ChainId._();

  static const int mainnet = 1;

  static const int ropsten = 3;

  static const int rinkeby = 4;

  static const int kovan = 42;

  static const int local = 31337;
}
