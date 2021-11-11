/**
 * Retrieve the private keys needed for Ethereums settlement and interactions
 * 
 * @param {SecretsManager} secretsManager Instance of AWS SDK Secrets Manager
 * @returns {String, String} Returns Alchemy API key and Executor Private Key
 */
async function getEthereumPrivateKeys(secretsManager) {
  let alchemyKey, executorPrivateKey;

  let alchemyKeyPromise = secretsManager.getSecretValue({SecretId: 'nouns/AlchemyKey'}, (_, data) => {
    alchemyKey = data.SecretString;
  }).promise();

  let executorKeyPromise = secretsManager.getSecretValue({SecretId: 'nouns/ExecutorPrivateKey'}, (_, data) => {
    executorPrivateKey = data.SecretString;
  }).promise();

  await Promise.all([alchemyKeyPromise, executorKeyPromise]); // Pull in parallel for speed

  return { alchemyKey, executorPrivateKey };
}

module.exports = {
  getEthereumPrivateKeys
};