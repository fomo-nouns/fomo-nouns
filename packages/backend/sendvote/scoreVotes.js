function hasWinningVotes(attr) {
  // Structure: {
  //   voteLove: 
  //   voteLike: 
  //   voteDislike: 
  //   voteHate: 
  //   totalConnected: 
  // }

  if (!attr.totalConnected) {
    return false;
  }

  let like = (attr.voteLike ?? 0);
  let love = (attr.voteLove ?? 0);
  let hate = (attr.voteHate ?? 0);

  let score = (1.5 * love + like - hate) / attr.totalConnected;

  if (score > 0.6) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  hasWinningVotes
};