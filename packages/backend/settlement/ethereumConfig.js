const { parseUnits } = require('@ethersproject/units');

// Configuration Settings
const NETWORK_NAME = 'mainnet';
const DEFAULT_PRIORITY_FEE = parseUnits('15', 'gwei');
const DEFAULT_MAX_SETTLEMENT_COST = parseUnits('0.12', 'ether');

// Key Addresses
const addresses = {
  auctionHouseProxy: {
    mainnet: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    rinkeby: '0x7cb0384b923280269b3BD85f0a7fEaB776588382'
  },
  settlementContract: {
    mainnet: '0xb2341612271e122ff20905c9e389c3d7f0F222a1',
    rinkeby: '0x6567F8eE62cd129049EE924c7B88a23be7DDaE5c'
  }
}

const AUCTION_HOUSE_ADDR = addresses.auctionHouseProxy[NETWORK_NAME];
const FOMO_SETTLER_ADDR = addresses.settlementContract[NETWORK_NAME];

module.exports = {
  NETWORK_NAME,
  AUCTION_HOUSE_ADDR,
  FOMO_SETTLER_ADDR,
  DEFAULT_PRIORITY_FEE,
  DEFAULT_MAX_SETTLEMENT_COST
}