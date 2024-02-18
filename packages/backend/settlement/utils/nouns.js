/**
 * Calculates the next Noun ID that will go to auction
 * 
 * @param {BigInt} currentNounId The currently completed auction NounId
 * @returns The next Noun ID that will go to auction
 */
function nextAuctionNounId(currentNounId) {
  let curNounId = Number(currentNounId);
  
  if (curNounId <= 1820 && curNounId % 10 == 0) {
    return curNounId+2;
  } else {
    return curNounId+1;
  }
}


module.exports = {
  nextAuctionNounId
}