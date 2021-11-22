require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require('./tasks');

const {
  FOMO_ALCHEMY_KEY,
  FOMO_EXECUTOR_KEY,
  ETHERSCAN_KEY,
  RINKEBY_DEPLOYER_KEY,
  MAINNET_DEPLOYER_KEY
} = process.env;

/**
 * Print List of Accounts for the Network
 */
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    let bal = await hre.ethers.provider.getBalance(account.address);
    console.log(`${account.address}: ${hre.ethers.utils.formatEther(bal)}`);
  }
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
   solidity: "0.8.9",
   networks: {
     rinkeby: {
       url: `https://eth-rinkeby.alchemyapi.io/v2/${FOMO_ALCHEMY_KEY}`,
       accounts: [`0x${FOMO_EXECUTOR_KEY}`,`0x${RINKEBY_DEPLOYER_KEY}`],
     },
     mainnet: {
       url: `https://eth-mainnet.alchemyapi.io/v2/${FOMO_ALCHEMY_KEY}`,
       accounts: [`0x${FOMO_EXECUTOR_KEY}`,`0x${MAINNET_DEPLOYER_KEY}`],
     },
     goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${FOMO_ALCHEMY_KEY}`,
      accounts: [`0x${FOMO_EXECUTOR_KEY}`,`0x${RINKEBY_DEPLOYER_KEY}`],
    },
   },
  etherscan: {
    apiKey: `${ETHERSCAN_KEY}`
  }
 };
