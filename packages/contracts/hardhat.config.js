require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require('./tasks');


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
   },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`
  }
 };
