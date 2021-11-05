// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "sendmessage", "nounId": "22", "blockhash": "a83d9e", "vote": "like"}
 * 
 */

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

/**
 * Update the DB counter
 * 
 * @param {Object} data Data to update in the DB
 * @returns {Integer} totalConnection count in the DB
 */
async function updateVote(dbKey, voteType) {
  const updateParams = {
    TableName: process.env.VOTE_TABLE_NAME,
    Key: { nounIdWithBlockHash: dbKey },
    ExpressionAttributeValues: { ':start': 0, ':incr': 1 },
    UpdateExpression: `set ${voteType} = if_not_exists(${voteType}, :start) + :incr`,
    ReturnValues: 'ALL_NEW'
  };

  try {
    let newValues = await ddb.update(updateParams).promise();
    return newValues.Attributes.totalConnected;
  } catch (err) {
    // If totalConnected was already updated, ignore error, otherwise throw
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
async function distributeVote(endpoint, voteType) {
  let connectionCount = 0;
  let connectionData;
  
  try {
    connectionData = await ddb.scan({ TableName: process.env.TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
  } catch (e) {
    throw e; //return { statusCode: 500, body: e.stack };
  }
  
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint
  });
  
  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: voteType }).promise();
      connectionCount++;
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb.delete({ TableName: process.env.TABLE_NAME, Key: { connectionId } }).promise();
      } else {
        throw e;
      }
    }
  });
  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    throw e; // return { statusCode: 500, body: e.stack };
  }

  return connectionCount;
}


/**
 * Update the connection count in the DB 
 * 
 * @param {Integer} count Count of connections
 */
async function updateCount(dbKey, count) {
  const updateParams = {
    TableName: process.env.VOTE_TABLE_NAME,
    Key: { nounIdWithBlockHash: dbKey },
    ExpressionAttributeValues: { ':newCount': count },
    ConditionExpression: 'attribute_not_exists(totalConnected)',
    UpdateExpression: 'set totalConnected = :newCount'
  };

  try {
    await ddb.update(updateParams).promise();
  } catch (err) {
    // If totalConnected was already updated, ignore error, otherwise throw
    if (err.code !== "ConditionalCheckFailedException") {
      throw err;
    }
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

  const vote = body.vote;
  const dbKey = `${body.nounId}||${body.blockhash}`;
  const endpoint = `${context.domainName}/${context.stage}`;

  let dbCount;
  try {
    dbCount = await updateVote(dbKey, vote);
  } catch(err) {
    return { statusCode: 500, body: 'Error updating vote in DB.', message: err.stack };
  }

  let distributeCount;
  try {
    distributeCount = await distributeVote(endpoint, vote);
  } catch(err) {
    return { statusCode: 500, body: 'Error distributing vote to clients.', message: err.stack };
  }

  if (!dbCount) { // Update iif dbCount was not present
    try {
      await updateCount(dbKey, distributeCount);
    } catch(err) {
      return { statusCode: 500, body: 'Error updating connection count.', message: err.stack };
    }
  }

  return { statusCode: 200, body: 'Vote updated.' };
};