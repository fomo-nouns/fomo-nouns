function hasWinningVotes(attr) {
  // Structure: {
  //   love: 
  //   basiclike: 
  //   dislike: 
  //   hate: 
  //   totalConnected: 
  // }

  if (!attr.totalConnected) {
    return false;
  }

  let like = (attr.basiclike ?? 0);
  let love = (attr.love ?? 0);
  let hate = (attr.hate ?? 0);

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