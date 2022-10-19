/**
 * Retrieve the private keys needed for Ethereums settlement and interactions
 * 
 * @param {SecretsManager} secretsManager Instance of AWS SDK Secrets Manager
 * @returns {String, String} Returns Google Project API Key, Google Cloud project ID, ReCaptcha v3 Enterprise key, ReCaptcha v3 Action and ReCaptcha Score Threshold
 */
async function getReCaptchaKeys(secretsManager) {
  let googleApiKey, googleProjectId, reCaptchaKey, reCaptchaAction, scoreThreshold;

  let googleApiKeyPromise = secretsManager.getSecretValue({ SecretId: 'nouns/GoogleApiKey' }, (_, data) => {
    googleApiKey = data.SecretString;
  }).promise();

  let googleProjectIdPromise = secretsManager.getSecretValue({ SecretId: 'nouns/GoogleProjectId' }, (_, data) => {
    googleProjectId = data.SecretString;
  }).promise();

  let reCaptchaKeyPromise = secretsManager.getSecretValue({ SecretId: 'nouns/ReCaptchaKey' }, (_, data) => {
    reCaptchaKey = data.SecretString;
  }).promise();

  let reCaptchaActionPromise = secretsManager.getSecretValue({ SecretId: 'nouns/ReCaptchaAction' }, (_, data) => {
    reCaptchaAction = data.SecretString;
  }).promise();

  let scoreThresholdPromise = secretsManager.getSecretValue({ SecretId: 'nouns/ReCaptchaThreshold' }, (_, data) => {
    scoreThreshold = data.SecretString;
  }).promise();

  await Promise.all([
    googleApiKeyPromise,
    googleProjectIdPromise,
    reCaptchaKeyPromise,
    reCaptchaActionPromise,
    scoreThresholdPromise
  ]); // Pull in parallel for speed

  return {
    googleApiKey: googleApiKey,
    googleProjectId: googleProjectId,
    reCaptchaKey: reCaptchaKey,
    reCaptchaAction: reCaptchaAction,
    reCaptchaThreshold: scoreThreshold
  };
}

module.exports = {
  getReCaptchaKeys
};