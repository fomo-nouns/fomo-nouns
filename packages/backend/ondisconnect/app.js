// SPDX-License-Identifier: MIT-0

// Modified from: https://github.com/aws-samples/simple-websockets-chat-app/blob/master/ondisconnect/app.js

const AWS = require('aws-sdk');

const { AWS_REGION, SOCKET_TABLE_NAME } = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: AWS_REGION });

exports.handler = async event => {
  const deleteParams = {
    TableName: SOCKET_TABLE_NAME,
    Key: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};