const hre = require('hardhat');
const { ethers } = hre;
const { address } = require('./config.js');
const prompt = require('prompt');


async function main() {
  const contractName = 'NounSettlement';
  const network = hre.network.name;

  const [executor, deployer] = await ethers.getSigners();
  const auctionHouseAddress = address.auctionHouseProxy[network];
  const nounsTreasuryAddress = address.nounsTreasury[network];
  const fomoMultisigAddress = address.fomoMultisig[network];

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

  const contractParameters = [
    executor.address,
    nounsTreasuryAddress,
    auctionHouseAddress,
    fomoMultisigAddress
  ];

  const deploymentGas = await factory.signer.estimateGas(
    factory.getDeployTransaction(...contractParameters, { gasPrice })
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

  const deployedContract = await factory.deploy(...contractParameters, { gasPrice });
  await deployedContract.deployed();

  console.log(`${contractName} contract deployed to ${deployedContract.address}`);

  console.log(`
    Executor address: ${executor.address}
    NounsTreasury address: ${nounsTreasuryAddress}
    AuctionHouse address: ${auctionHouseAddress}
    FOMO Multisig address: ${fomoMultisigAddress}
  `);

  // Wait 10 seconds for bytecode to sync
  console.log('Waiting for Etherscan to sync...');
  await new Promise(resolve => setTimeout(resolve, 10 * 1000))

  // Verify on Etherscan
  await hre.run("verify:verify", {
    address: deployedContract.address,
    constructorArguments: contractParameters
  });
}

// Execute Deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
