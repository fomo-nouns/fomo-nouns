// SPDX-License-Identifier: MIT-0

/**
 * Event Example:
 *   {"action": "checkcaptcha", "token": "..."}
 * 
 */

const AWS = require('aws-sdk');
const axios = require('axios');

const {
  AWS_REGION,
  SOCKET_TABLE_NAME,
  GOOGLE_PROJECT_ID,
  RECAPTCHA_THRESHOLD,
  RECAPTCHA_ACTION
} = process.env;

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
    reCaptchaKey
  } = await getReCaptchaKeys(smc);

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/assessments?key=${googleApiKey}`
  const params = {
    event: {
      token: token,
      siteKey: reCaptchaKey,
      expectedAction: RECAPTCHA_ACTION
    }
  }

  const response = await axios.post(url, params)

  if (response.status == 200) {
    const valid = response.data.tokenProperties.valid;
    const action = response.data.tokenProperties.action;
    const expectedAction = response.data.event.expectedAction;
    const score = response.data.riskAnalysis.score;

    const actionsMatch = action == expectedAction;
    const scorePassed = score >= RECAPTCHA_THRESHOLD;

    if (valid && actionsMatch && scorePassed) {
      return true
    } else {
      return false
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
    console.error(err)
    return { statusCode: 500, body: 'Error validating captcha', message: err.stack };
  }

  return { statusCode: 200, body: 'Captcha status updated.' };
};