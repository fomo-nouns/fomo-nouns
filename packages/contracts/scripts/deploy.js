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

  console.log(`Preparing to deploy ${contractName} to ${network.toUpperCase()} with the account ${deployer.address}`);
  console.log(`Account balance: ${(ethers.utils.formatEther(await deployer.getBalance()))}`);

  const contractParameters = [
    executor.address,
    nounsTreasuryAddress,
    auctionHouseAddress,
    fomoMultisigAddress
  ];

  console.log(`
  Contract Constructor:
    [0] Executor address: ${contractParameters[0]}
    [1] NounsTreasury address: ${contractParameters[1]}
    [2] AuctionHouse address: ${contractParameters[2]}
    [4] FOMO Multisig address: ${contractParameters[3]}
  `);

  // Get network gas and ask for user desired gas price
  let feeData = await ethers.provider.getFeeData();
  const baseGasInGwei = Math.round(Number(ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei')));

  prompt.start();

  let result = await prompt.get([{ properties: {
    maxBaseFee: { type: 'integer', required: true, description: 'Enter max base gas price (gwei)', default: baseGasInGwei },
  }}]);

  let maxBaseFee = ethers.utils.parseUnits(result.maxBaseFee.toString(), 'gwei');
  let maxPriorityFee = ethers.utils.parseUnits('1', 'gwei');

  let gasFees = {
    maxPriorityFeePerGas: maxPriorityFee,
    maxFeePerGas: maxBaseFee.add(maxPriorityFee)
  };
  
  console.log(`
  Gas configuration:
    maxBaseFee: ${ethers.utils.formatUnits(maxBaseFee, 'gwei')}
    maxPriorityFeePerGas ${ethers.utils.formatUnits(gasFees.maxPriorityFeePerGas, 'gwei')}
    maxFeePerGas ${ethers.utils.formatUnits(gasFees.maxFeePerGas, 'gwei')}
  `);

  // Estimate the deployment cost in ETH
  const factory = await ethers.getContractFactory(contractName, deployer);

  const deploymentGas = await factory.signer.estimateGas(
    factory.getDeployTransaction(...contractParameters, gasFees)
  );
  const deploymentCost = deploymentGas.mul(gasFees.maxFeePerGas);

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

  const deployedContract = await factory.deploy(...contractParameters, gasFees);
  await deployedContract.deployed();

  console.log(`${contractName} contract deployed to ${deployedContract.address}`);

  // Wait 10 seconds for bytecode to sync
  console.log('Waiting for Etherscan to sync...');
  await new Promise(resolve => setTimeout(resolve, 15 * 1000))

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
