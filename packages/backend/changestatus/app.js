// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "changestatus", "status": "active"}
 * 
 */

const AWS = require('aws-sdk');

const { AWS_REGION, SOCKET_TABLE_NAME } = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: AWS_REGION });


async function updateStatus(connectionId, isInactive) {
  const updateParams = {
    TableName: SOCKET_TABLE_NAME,
    Key: { 'connectionId': connectionId },
    ExpressionAttributeValues: { ':inactiveStatus': isInactive},
    UpdateExpression: 'set inactive = :inactiveStatus'
  };

  try {
    await ddb.update(updateParams).promise();
  } catch (err) {
    throw err;
  }
}


exports.handler = async event => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body);

  const isInactive = body.status === 'inactive' ? true : false;
  
  try {
    await updateStatus(connectionId, isInactive);
  } catch(err) {
    return { statusCode: 500, body: 'Error updating status in DB.', message: err.stack };
  }

  return { statusCode: 200, body: 'Status updated.' };
};