// SPDX-License-Identifier: MIT-0

// Modified from: https://github.com/aws-samples/simple-websockets-chat-app/blob/master/onconnect/app.js

const AWS = require('aws-sdk');

const { AWS_REGION, SOCKET_TABLE_NAME } = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: AWS_REGION });

exports.handler = async event => {
  const putParams = {
    TableName: SOCKET_TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};