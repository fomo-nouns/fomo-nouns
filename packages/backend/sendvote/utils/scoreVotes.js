/**
 * Evaluate the provided votes to provide a score
 * 
 * Valid vote types
 *  - voteLove
 *  - voteLike
 *  - voteDislike
 *  - voteHate
 * 
 * @param {Object} voteObj Object with a count of votes by type. Any key may be
 *    missing if votes of that type are missing.
 * @param {Number} userCount Count of connected users
 * @returns {Number} Calculated score
 */
function scoreVotes(voteObj, userCount) {
  let winThreshold = 0.6;

  let like = (voteObj.voteLike ?? 0);
  let love = (voteObj.voteLove ?? 0);
  let hate = (voteObj.voteHate ?? 0);

  if (!userCount) {
    return 0;
  } else {
    let score = (1.5 * love + like - hate) / userCount;
    return score / winThreshold;
  }
}


/**
 * Return true if the score is a "winning" score, else return false
 * 
 * @param {Number} score Calculated vote score
 * @returns {Boolean} True if the votes meet the "win" threshold, otherwise false
 */
function hasWinningScore(score) {
  return (score > 1) ? true : false;
}


/**
 * Score the votes and return whether the votes are a winning quorum
 * 
 * @param {Object} voteObj Object with a count of votes by type. Any key may be
 *    missing if votes of that type are missing.
 * @param {Number} userCount Count of connected users
 * @returns {Boolean} True if the votes meet the "win" threshold, otherwise false
 */
function hasWinningVotes(voteObj, userCount) {
  let score = scoreVotes(voteObj, userCount);
  return hasWinningScore(score);
}




module.exports = {
  scoreVotes,
  hasWinningScore,
  hasWinningVotes
};