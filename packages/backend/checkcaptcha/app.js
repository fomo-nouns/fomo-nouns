// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "checkcaptcha", "token": "..."}
 * 
 */

const AWS = require('aws-sdk');
const axios = require('axios').default;

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

async function checkRecaptcha(token) {
  const {
    googleApiKey,
    googleProjectId,
    reCaptchaKey,
    reCaptchaAction,
    reCaptchaThreshold
  } = await getReCaptchaKeys(smc);

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${googleProjectId}/assessments?key=${googleApiKey}`
  const params = {
    event: {
      token: token,
      siteKey: reCaptchaKey,
      expectedAction: reCaptchaAction
    }
  }

  const response = await axios.post(url, params)

  if (response.status == 200) {
    const valid = response.data.tokenProperties.valid
    if (valid) {
      const score = response.data.riskAnalysis.score

      if (score >= reCaptchaThreshold) {
        return true
      } else {
        return false
      }
    } else {
      const reason = response.data.tokenProperties.invalidReason
      throw Error(`Token Validity: token is not valid, reason: ${reason}`)
    }
  } else {
    throw Error(`Request: request returned with status: ${response.status} and data: ${response.data}`)
  }
}


exports.handler = async event => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body);
  const token = body.token;

  let captchaPassed
  try {
    captchaPassed = await checkRecaptcha(token);
    await updateStatus(connectionId, captchaPassed);
  } catch (err) {
    return { statusCode: 500, body: 'Error validating captcha', message: err.stack };
  }

  return { statusCode: 200, body: 'Captcha status updated.' };
};