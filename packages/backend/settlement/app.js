// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "sendvote", "nounId": "22", "blockhash": "a83d9e", "vote": "voteLike"}
 * 
 */

const DynamoDB = require('aws-sdk/clients/dynamodb');
const SecretsManager = require('aws-sdk/clients/secretsmanager');

const { AlchemyProvider } = require('@ethersproject/providers');
const { Wallet } = require('ethers');

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
    // If settlement was already attempted, ignore
    if (err.code !== "ConditionalCheckFailedException") {
      throw err;
    }
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
  const body = JSON.parse(event.body);
  const dbKey = `${body.nounId}||${body.blockhash}`;
  const blockhash = body.blockhash;

  await initSigner();

  try {
    await updateStatus(dbKey, signer, body.blockhash);
    await submitSettlement(signer, blockhash);
    console.log('Settlement completed.');
  } catch(err) {
    return { statusCode: 500, body: 'Error settling.', message: err.stack };
  }

  return { statusCode: 200, body: 'Vote updated.' };
};