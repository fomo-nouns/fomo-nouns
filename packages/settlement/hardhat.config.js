require("@nomiclabs/hardhat-waffle");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
   solidity: "0.8.6",
   networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
        blockNumber: 13365089 // One block prior to Noun 64 settlement at Oct-06-2021 11:20:49 AM +UTC
      }
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_RINKEBY_KEY}`,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      accounts: [`0x${process.env.MAINNET_PRIVATE_KEY}`],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_RINKEBY_KEY}`,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    },
   }
 };
