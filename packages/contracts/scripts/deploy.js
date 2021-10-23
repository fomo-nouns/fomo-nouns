const hre = require('hardhat');
const { ethers } = hre;
const { address } = require('./config.js');
const prompt = require('prompt');


async function main() {
  const contractName = 'NounSettlement';
  const network = hre.network.name;

  const [deployer] = await ethers.getSigners();
  const auctionHouseAddress = address.auctionHouseProxy[network];
  const nounsDaoAddress = deployer.address; // Use another test account instead

  console.log(`Preparing to deploy ${contractName} to ${network} with the account ${deployer.address}`);
  console.log(`Account balance: ${(ethers.utils.formatEther(await deployer.getBalance()))}`);

  // Get network gas and ask for user desired gas price
  let gasPrice = await ethers.provider.getGasPrice();
  const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gasPrice, 'gwei')));

  prompt.start();

  let result = await prompt.get([{ properties: {
    gasPrice: { type: 'integer', required: true, description: 'Enter a gas price (gwei)', default: gasInGwei },
  }}]);

  gasPrice = ethers.utils.parseUnits(result.gasPrice.toString(), 'gwei');

  // Estimate the deployment cost in ETH
  const factory = await ethers.getContractFactory(contractName);

  const deploymentGas = await factory.signer.estimateGas(
    factory.getDeployTransaction(deployer.address, auctionHouseAddress, nounsDaoAddress, { gasPrice })
  );
  const deploymentCost = deploymentGas.mul(gasPrice);

  console.log(`Estimated cost to deploy ${contractName}: ${ethers.utils.formatEther(deploymentCost)} ETH`);

  result = await prompt.get([{ properties: {
    confirm: { type: 'string', description: 'Type "DEPLOY" to confirm:'},
  }}]);

  if (result.confirm != 'DEPLOY') {
    console.log('Exiting');
    return;
  }

  // Deploy the contract
  console.log(`Deploying ${contractName}...`);

  const deployedContract = await factory.deploy(deployer.address, auctionHouseAddress, nounsDaoAddress, { gasPrice });
  await deployedContract.deployed();

  console.log(`${contractName} contract deployed to ${deployedContract.address}`);

  console.log(`
    Executor address: ${deployer.address}
    AuctionHouse address: ${auctionHouseAddress}
    NounsDAO address: ${nounsDaoAddress}
  `);
}

// Execute Deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
