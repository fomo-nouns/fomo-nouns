const { ethers } = require('ethers');

// Mock AWS SDK v3
const mockSend = jest.fn().mockResolvedValue({});
const mockDynamoDBClient = {
  send: mockSend
};

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(() => mockDynamoDBClient)
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn(() => mockDynamoDBClient)
  },
  PutCommand: jest.fn((params) => ({ ...params, type: 'Put' }))
}));

// Set required environment variables
process.env.SOCKET_TABLE_NAME = 'test-table';
process.env.AWS_REGION = 'us-east-1';

// Import handler after mocking
const { handler } = require('../app');

describe('onconnect handler', () => {
  const connectionId = 'test-connection-id';
  const connectedAt = Date.now();
  const validNounId = '123';
  let validSignature;
  let wallet;

  beforeEach(async () => {
    // Reset mock
    mockSend.mockClear();
    mockSend.mockResolvedValue({});

    // Create valid signature
    wallet = ethers.Wallet.createRandom();
    const address = await wallet.getAddress();
    const message = `Authenticate FOMO Nouns voting for ${validNounId} with ${address.toLowerCase()}`;
    validSignature = await wallet.signMessage(message);
  });

  test('accepts valid signature and stores connection', async () => {
    const event = {
      requestContext: { connectionId, connectedAt },
      queryStringParameters: {
        signature: validSignature,
        address: await wallet.getAddress(),
        nounId: validNounId
      }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      TableName: 'test-table',
      Item: expect.objectContaining({
        connectionId,
        connectedAt,
        verifiedAddress: (await wallet.getAddress()).toLowerCase()
      })
    }));
  });

  test('rejects missing signature fields', async () => {
    const event = {
      requestContext: { connectionId, connectedAt },
      queryStringParameters: {
        // Missing signature
        address: await wallet.getAddress(),
        nounId: validNounId
      }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body).error).toBe('missing_fields');
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('rejects invalid signature', async () => {
    const event = {
      requestContext: { connectionId, connectedAt },
      queryStringParameters: {
        signature: 'invalid-signature',
        address: await wallet.getAddress(),
        nounId: validNounId
      }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body).error).toBe('invalid_signature');
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('rejects signature from wrong address', async () => {
    // Create signature from different wallet
    const differentWallet = ethers.Wallet.createRandom();
    const address = await wallet.getAddress();
    const message = `Authenticate FOMO Nouns voting for ${validNounId} with ${address.toLowerCase()}`;
    const wrongSignature = await differentWallet.signMessage(message);

    const event = {
      requestContext: { connectionId, connectedAt },
      queryStringParameters: {
        signature: wrongSignature,
        address: await wallet.getAddress(),
        nounId: validNounId
      }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body).error).toBe('invalid_signature');
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('handles DynamoDB errors', async () => {
    mockSend.mockRejectedValue(new Error('DynamoDB error'));

    const event = {
      requestContext: { connectionId, connectedAt },
      queryStringParameters: {
        signature: validSignature,
        address: await wallet.getAddress(),
        nounId: validNounId
      }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe('internal_error');
  });

  test('handles case-insensitive addresses', async () => {
    const address = await wallet.getAddress();
    const upperAddress = address.toUpperCase();
    const message = `Authenticate FOMO Nouns voting for ${validNounId} with ${upperAddress.toLowerCase()}`;
    const signature = await wallet.signMessage(message);

    const event = {
      requestContext: { connectionId, connectedAt },
      queryStringParameters: {
        signature,
        address: upperAddress,
        nounId: validNounId
      }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      TableName: 'test-table',
      Item: expect.objectContaining({
        verifiedAddress: upperAddress.toLowerCase()
      })
    }));
  });
}); 