/**
 * Retrieve the private keys needed for Ethereums settlement and interactions
 * 
 * @param {SecretsManager} secretsManager Instance of AWS SDK Secrets Manager
 * @returns {String, String} Returns Google Project API Key, Google Cloud project ID, ReCaptcha v3 Enterprise key, ReCaptcha v3 Action and ReCaptcha Score Threshold
 */
async function getReCaptchaKeys(secretsManager) {
  let googleApiKey, reCaptchaKey;

  let googleApiKeyPromise = secretsManager.getSecretValue({ SecretId: 'nouns/GoogleApiKey' }, (_, data) => {
    googleApiKey = data.SecretString;
  }).promise();

  let reCaptchaKeyPromise = secretsManager.getSecretValue({ SecretId: 'nouns/ReCaptchaKey' }, (_, data) => {
    reCaptchaKey = data.SecretString;
  }).promise();

  await Promise.all([
    googleApiKeyPromise,
    reCaptchaKeyPromise
  ]); // Pull in parallel for speed

  return {
    googleApiKey: googleApiKey,
    reCaptchaKey: reCaptchaKey
  };
}

module.exports = {
  getReCaptchaKeys
};