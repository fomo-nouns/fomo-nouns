const { expect } = require('chai');
const { activeUserCount } = require('../utils/connectionFilter');


describe('activeUserCount Test', async function() {
  it('Should count only active users', function() {
    let connectionSet = [
      {'connection': 1},
      {'connection': 2, 'inactive': false},
      {'connection': 3, 'inactive': true}
    ];
    let result = activeUserCount(connectionSet);
    expect(result).to.equal(2);
  });
});