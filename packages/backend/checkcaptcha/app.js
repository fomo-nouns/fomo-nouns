// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "checkcaptcha", "token": "..."}
 * 
 */

const AWS = require('aws-sdk');

const { AWS_REGION, SOCKET_TABLE_NAME } = process.env;

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: AWS_REGION });
const smc = new AWS.SecretsManager({ region: AWS_REGION });

const { getReCaptchaKeys } = require('./utils/getReCaptchaKeys.js');


async function updateStatus(connectionId, captchaPassed) {
  const updateParams = {
    TableName: SOCKET_TABLE_NAME,
    Key: { 'connectionId': connectionId },
    ExpressionAttributeValues: { ':cp': captchaPassed },
    UpdateExpression: 'set captchaPassed = :cp'
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
  const token = body.token;

  const {
    googleApiKey,
    googleProjectId,
    reCaptchaKey,
    reCaptchaAction,
    reCaptchaThreshold
  } = await getReCaptchaKeys(smc);

  //TODO: the fetch

  const captchaPassed = true;

  try {
    await updateStatus(connectionId, captchaPassed);
  } catch (err) {
    return { statusCode: 500, body: 'Error updating captcha status in DB.', message: err.stack };
  }

  return { statusCode: 200, body: 'Captcha status updated.' };
};