const SecretsManager = require('aws-sdk/clients/secretsmanager');
const smc = new SecretsManager({ region: process.env.AWS_REGION });

/**
 * Retrieve the private keys needed for Ethereums settlement and interactions
 * 
 * @returns {String, String} Returns Alchemy API key and Executor Private Key
 */
async function getEthereumPrivateKeys() {
  let alchemyKey = await smc.getSecretValue({SecretId: 'nouns/AlchemyKey'}).promise();
  let executorPrivateKey = await smc.getSecretValue({SecretId: 'nouns/ExecutorPrivateKey'}).promise();

  return { alchemyKey, executorPrivateKey };
}

module.exports = {
  getEthereumPrivateKeys
};