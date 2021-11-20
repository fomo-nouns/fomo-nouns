// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "sendvote", "nounId": "22", "blockhash": "a83d9e", "vote": "voteLike"}
 * 
 */

const DynamoDB = require('aws-sdk/clients/dynamodb');
const ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi');
const Lambda = require('aws-sdk/clients/lambda');

const { hasWinningVotes } = require('./utils/scoreVotes.js');

const {
  AWS_REGION,
  SOCKET_TABLE_NAME,
  VOTE_TABLE_NAME,
  SETTLEMENT_FUNCTION_NAME
} = process.env;

const ddb = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: AWS_REGION });
const lambda = new Lambda({ apiVersion: '2015-03-31', region: AWS_REGION });


/**
 * Update the DB vote counts
 * 
 * @param {Object} dbKey Combined nounId||blockhash key used to track votes
 * @param {String} voteType Vote label cast by the user, e.g. voteLike
 * @returns {Object} Object with the newly updated data from the DB
 */
async function updateVote(dbKey, voteType) {
  const updateParams = {
    TableName: VOTE_TABLE_NAME,
    Key: { nounIdWithBlockHash: dbKey },
    ExpressionAttributeValues: { ':start': 0, ':incr': 1 },
    UpdateExpression: `set ${voteType} = if_not_exists(${voteType}, :start) + :incr`,
    ReturnValues: 'ALL_NEW'
  };

  try {
    let newValues = await ddb.update(updateParams).promise();
    return newValues.Attributes;
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      throw err;
    }
  }
}


/**
 * Distribute the data to each client
 * 
 * @param {Object} data Data to distribute to all clients
 */
async function distributeMessage(endpoint, jsonMessage) {
  let messageString = JSON.stringify(jsonMessage);
  let connectionCount = 0;
  let connectionData;
  
  try {
    connectionData = await ddb.scan({ TableName: SOCKET_TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
  } catch (e) {
    throw e;
  }
  
  const apigwManagementApi = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint
  });
  
  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: messageString }).promise();
      connectionCount++;
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb.delete({ TableName: SOCKET_TABLE_NAME, Key: { connectionId } }).promise();
      } else {
        throw e;
      }
    }
  });
  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    throw e;
  }

  return connectionCount;
}


/**
 * Invoke the Settlement Lambda function asynchronously
 * 
 * @param {String} nounId ID number of the upcoming to-be-minted Noun
 * @param {String} blockhash Blockhash of the most recently mined block
 */
async function callSettlement(nounId, blockhash) {
  var params = {
    FunctionName: SETTLEMENT_FUNCTION_NAME,
    InvokeArgs: JSON.stringify({'nounId': nounId, 'blockhash': blockhash})
  };

  try {
    await lambda.invokeAsync(params).promise();
  } catch (err) {
    throw err;
  }
}


/**
 * 
 * @param {Object} event
 *    event.body:
 *      - nounId
 *      - blockhash
 *      - vote
 */
exports.handler = async event => {
  const body = JSON.parse(event.body);
  const context = event.requestContext;

  const { vote, nounId, blockhash } = body;

  const dbKey = `${nounId}||${blockhash}`;
  const endpoint = `${context.domainName}/${context.stage}`;

  // Update the DB with the latest vote
  let newValues;
  try {
    newValues = await updateVote(dbKey, vote);
  } catch(err) {
    return { statusCode: 500, body: 'Error updating vote in DB.', message: err.stack };
  }

  // Distribute votes to clients
  let distributeCount;
  try {
    distributeCount = await distributeMessage(endpoint, {'blockhash': blockhash, 'vote': vote});
  } catch(err) {
    return { statusCode: 500, body: 'Error distributing vote to clients.', message: err.stack };
  }

  // Launch settlement if new values signal voting has won
  if (!newValues.settled && hasWinningVotes(newValues, distributeCount)) {
    console.log(`Winning votes tallied for ${dbKey}, launching settlement...`);
    await callSettlement(nounId, blockhash);
    await distributeMessage(endpoint, {'blockhash': blockhash, 'status': 'attemptingSettlement'});
  }

  // Return successfully
  return { statusCode: 200, body: 'Vote updated.' };
};