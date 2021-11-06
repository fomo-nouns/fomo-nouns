function hasWinningVotes(voteAttributes) {
  // Structure: {
  //   love: 
  //   basiclike: 
  //   dislike: 
  //   hate: 
  //   totalConnected: 
  // }

  let like = (voteAttributes.basiclike ?? 0);
  let love = (voteAttributes.love ?? 0);
  let hate = (voteAttributes.hate ?? 0);
  let count = (voteAttributes.totalConnected ?? 1);

  let score = (1.5 * love + like - hate) / count;

  if (score > 0.6) {
    return true;
  } else {
    return false;
  }
}

modules.export = {
  hasWinningVotes
};