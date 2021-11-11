/**
 * Retrieve the private keys needed for Ethereums settlement and interactions
 * 
 * @param {SecretsManager} secretsManager Instance of AWS SDK Secrets Manager
 * @returns {String, String} Returns Alchemy API key and Executor Private Key
 */
async function getEthereumPrivateKeys(smc) {
  let alchemyKey = await smc.getSecretValue({SecretId: 'nouns/AlchemyKey'}).promise();
  let executorPrivateKey = await smc.getSecretValue({SecretId: 'nouns/ExecutorPrivateKey'}).promise();

  return { alchemyKey, executorPrivateKey };
}

module.exports = {
  getEthereumPrivateKeys
};