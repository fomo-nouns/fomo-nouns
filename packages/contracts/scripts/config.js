const abi = {};
const address = {
  auctionHouseProxy: {
    'mainnet': '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    'rinkeby': '0x7cb0384b923280269b3BD85f0a7fEaB776588382',
    'goerli': '0x7515E81BAdb94010F1D5a355c0d713fe752fB385'
  },
  nounsSeeder: {
    'mainnet': '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
    'rinkeby': '0xA98A1b1Cc4f5746A753167BAf8e0C26AcBe42F2E',
    'goerli': '0x1403Acbd7f1c2Bcc93aaB43fa866af44F4429e2F'
  },
  nounsDescriptor: {
    'mainnet': '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
    'rinkeby': '0x53cB482c73655D2287AE3282AD1395F82e6a402F',
    'goerli': '0xc2Ffe13C23E9d6182a07293Fbe1f31278bAfe74E'
  },
  nounsToken: {
    'mainnet': '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    'rinkeby': '0x632f34c3aee991b10D4b421Bc05413a03d7a37eB',
    'goerli': '0x22932551387D271B4fe512c6af209d0724360183'
  }
}

abi.auctionHouseProxy = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bool","name":"extended","type":"bool"}],"name":"AuctionBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"AuctionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"AuctionExtended","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minBidIncrementPercentage","type":"uint256"}],"name":"AuctionMinBidIncrementPercentageUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reservePrice","type":"uint256"}],"name":"AuctionReservePriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AuctionSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timeBuffer","type":"uint256"}],"name":"AuctionTimeBufferUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"auction","outputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"address payable","name":"bidder","type":"address"},{"internalType":"bool","name":"settled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"nounId","type":"uint256"}],"name":"createBid","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"duration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract INounsToken","name":"_nouns","type":"address"},{"internalType":"address","name":"_weth","type":"address"},{"internalType":"uint256","name":"_timeBuffer","type":"uint256"},{"internalType":"uint256","name":"_reservePrice","type":"uint256"},{"internalType":"uint8","name":"_minBidIncrementPercentage","type":"uint8"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minBidIncrementPercentage","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nouns","outputs":[{"internalType":"contract INounsToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reservePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_minBidIncrementPercentage","type":"uint8"}],"name":"setMinBidIncrementPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reservePrice","type":"uint256"}],"name":"setReservePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timeBuffer","type":"uint256"}],"name":"setTimeBuffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settleAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settleCurrentAndCreateNewAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timeBuffer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

module.exports = {
  abi,
  address
};