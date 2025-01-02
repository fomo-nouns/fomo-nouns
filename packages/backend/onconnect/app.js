// SPDX-License-Identifier: MIT-0

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { verifyMessage } = require('ethers');

const { AWS_REGION, SOCKET_TABLE_NAME } = process.env;

const client = new DynamoDBClient({ region: AWS_REGION });
const ddb = DynamoDBDocumentClient.from(client);

/**
 * Verify the signature provided with the connection
 * 
 * @param {string} nounId The ID of the Noun being voted on
 * @param {string} claimedAddress The address that claims to have signed the message
 * @param {string} signature The signature to verify
 * @returns {boolean} Whether the signature is valid
 */
function verifySignature(nounId, claimedAddress, signature) {
  try {
    const message = `Authenticate FOMO Nouns voting for ${nounId} with ${claimedAddress.toLowerCase()}`;
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === claimedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

exports.handler = async event => {
  const { connectionId, connectedAt } = event.requestContext;
  
  // Get auth data from query parameters
  const queryParams = event.queryStringParameters || {};
  const { signature, address, nounId } = queryParams;

  // Require all signature fields
  if (!signature || !address || !nounId) {
    return { 
      statusCode: 403, 
      body: JSON.stringify({
        error: 'missing_fields',
        message: 'Signature, address, and nounId are required'
      })
    };
  }

  if (!verifySignature(nounId, address, signature)) {
    return { 
      statusCode: 403, 
      body: JSON.stringify({
        error: 'invalid_signature',
        message: 'Invalid signature'
      })
    };
  }

  const putParams = {
    TableName: SOCKET_TABLE_NAME,
    Item: {
      connectionId,
      connectedAt,
      inactive: true,
      verifiedAddress: address.toLowerCase(),
      verifiedForNounId: nounId
    }
  };

  try {
    await ddb.send(new PutCommand(putParams));
  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({
        error: 'internal_error',
        message: 'Failed to connect: ' + err.message
      })
    };
  }

  return { statusCode: 200, body: 'Connected.' };
};