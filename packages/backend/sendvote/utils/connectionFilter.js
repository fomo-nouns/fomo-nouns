/**
 * Return connections that are not marked as inactive
 * 
 * @param {Object} connections DynamoDB item set with 'inactive' marked true if
 *                             a user is inactive
 * @returns {Boolean} True if the votes meet the "win" threshold, otherwise false
 */
function activeUserCount(connections) {
  return connections.filter(i => !i.inactive).length;
}


module.exports = {
  activeUserCount
};