// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "sendvote", "nounId": "22", "blockhash": "a83d9e", "vote": "voteLike"}
 * 
 */

const DynamoDB = require('aws-sdk/clients/dynamodb');
const SecretsManager = require('aws-sdk/clients/secretsmanager');

const { AlchemyProvider } = require('ethers/providers');
const { Wallet } = require('ethers/wallet');

const { NETWORK_NAME } = require('./ethereumConfig.js');
const { getEthereumPrivateKeys } = require('./utils/getEthereumPrivateKeys.js');
const { submitSettlement } = require('./utils/settlement.js');

const {
  AWS_REGION,
  VOTE_TABLE_NAME
} = process.env;

const ddb = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: AWS_REGION });
const smc = new SecretsManager({ region: AWS_REGION });

// Keep as a 
var signer;


/**
 * Launch settlement of the Nouns auction
 * 
 * @param {Integer} count Count of connections
 */
 async function updateStatus(dbKey) {
  const updateParams = {
    TableName: VOTE_TABLE_NAME,
    Key: { nounIdWithBlockHash: dbKey },
    ExpressionAttributeValues: { ':status': true },
    ConditionExpression: 'attribute_not_exists(settled)',
    UpdateExpression: 'set settled = :status'
  };

  try {
    // Lock the DB to prevent duplicate settlement
    await ddb.update(updateParams).promise();
  } catch (err) {
    throw err;
  }
}


async function initSigner() {
  let { alchemyKey, executorPrivateKey } = await getEthereumPrivateKeys(smc);
  let provider = new AlchemyProvider(NETWORK_NAME, alchemyKey);
  signer = new Wallet(executorPrivateKey, provider);
  console.log('Signer initialized');
}


/**
 * 
 * @param {Object} event
 *    event.body:
 *      - nounId
 *      - blockhash
 */
exports.handler = async event => {
  // Event is passed by invoke and already in JSON format
  const { nounId, blockhash } = event;
  const dbKey = `${nounId}||${blockhash}`;

  await initSigner();

  try {
    await updateStatus(dbKey, signer, blockhash);
    await submitSettlement(signer, blockhash);
  } catch(err) {
    // If settlement was already attempted, ignore
    if (err.code !== "ConditionalCheckFailedException") {
      return { statusCode: 200, body: 'Auction settlement already launched.' };
    } else {
      return { statusCode: 500, body: 'Error with settlement.', message: err.stack };
    }
  }

  return { statusCode: 200, body: 'Settlement completed.' };
};