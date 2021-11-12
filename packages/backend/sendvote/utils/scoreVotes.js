/**
 * Score the provided votes to determine if they're sufficient to win the
 * tally.
 * 
 * Object must include the number of connected users
 *  - totalConnected
 * 
 * Valid vote types
 *  - voteLove
 *  - voteLike
 *  - voteDislike
 *  - voteHate
 * 
 * @param {Object} voteObj Object with a count of votes by type. Any key may be
 *    missing if votes of that type are missing.
 * @returns {Boolean} True if the votes meet the "win" threshold, otherwise false
 */
function hasWinningVotes(voteObj, userCount) {
  if (!userCount) {
    return false;
  }

  let like = (voteObj.voteLike ?? 0);
  let love = (voteObj.voteLove ?? 0);
  let hate = (voteObj.voteHate ?? 0);

  let score = (1.5 * love + like - hate) / userCount;

  if (score > 0.6) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  hasWinningVotes
};