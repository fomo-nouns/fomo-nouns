const NETWORK_NAME = 'rinkeby';
const AUCTION_HOUSE_ADDR = '0x7cb0384b923280269b3BD85f0a7fEaB776588382';
const FOMO_SETTLER_ADDR = '0xFa7C3ab143074BcbF09db8450810d78E4B9b19a3';

const { parseUnits } = require('@ethersproject/units');
const DEFAULT_PRIORITY_FEE = parseUnits('20', 'gwei');
const DEFAULT_MAX_SETTLEMENT_COST = parseUnits('0.06', 'ether');

module.exports = {
  NETWORK_NAME,
  AUCTION_HOUSE_ADDR,
  FOMO_SETTLER_ADDR,
  DEFAULT_PRIORITY_FEE,
  DEFAULT_MAX_SETTLEMENT_COST
}