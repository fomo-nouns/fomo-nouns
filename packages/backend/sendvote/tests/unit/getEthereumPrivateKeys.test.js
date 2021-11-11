const { expect } = require('chai');
const { getEthereumPrivateKeys } = require('../../utils/getEthereumPrivateKeys');

const SecretsManager = require('aws-sdk/clients/secretsmanager');


describe('getEthereumPrivateKeys Test', async function() {
  const smc = new SecretsManager({ region: 'us-east-1' });

  it("should retrieve an Alchemy API key", async function() {
    let { alchemyKey } = await getEthereumPrivateKeys(smc);
    expect(alchemyKey).to.exist;
    expect(alchemyKey).to.be.a('string');
    expect(alchemyKey.length).to.equal(32);
  });

  it("should retrieve an Ethereum key", async function() {
    let { executorPrivateKey } = await getEthereumPrivateKeys(smc);
    expect(executorPrivateKey).to.exist;
    expect(executorPrivateKey).to.be.a('string');
    expect(executorPrivateKey.length).to.equal(66);
  });
});