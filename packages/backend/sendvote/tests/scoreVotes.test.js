const { expect } = require('chai');
const { scoreVotes, hasWinningScore, hasWinningVotes } = require('../utils/scoreVotes');


describe('hasWinningVotes Test', async function() {

  describe('Single Vote', async function() {
    it('Like vote should WIN', async function() {
      let result = hasWinningVotes({voteLike: 1}, 1);
      expect(result).to.be.true;
    });

    it('Dislike vote should LOSE', async function() {
      let result = hasWinningVotes({voteDislike: 1}, 1);
      expect(result).to.be.false;
    });

    it('Shrug vote should LOSE', async function() {
      let result = hasWinningVotes({voteShrug: 1}, 1);
      expect(result).to.be.false;
    });
  });

  describe('Validate 0.6 Threshold', async function() {
    it('Should LOSE with 60/100 votes', async function() {
      let result1 = hasWinningVotes({voteLike: 60}, 100);
      expect(result1).to.be.false;
    });

    it('Should WIN with 61/100 votes', async function() {
      let result2 = hasWinningVotes({voteLike: 61}, 100);
      expect(result2).to.be.true;
    });
  });

  describe('Vote Type Weighting', async function() {
    it('Should ignore shrugs', async function() {
      let result = hasWinningVotes({voteLike: 61, voteShrug: 1}, 100);
      expect(result).to.be.true;
    });

    it('Should let 2 dislike vote counteract 1 like', async function() {
      let result = hasWinningVotes({voteLike: 61, voteDislike: 2}, 100);
      expect(result).to.be.false;
    });
  });
});

describe('hasWinningVotes Test', async function() {
  it('Should handle empty votes', async function() {
    let result = scoreVotes({}, 0);
    expect(result).to.equal(0);
  });

  it('Should ignore votes with no count', async function() {
    let result = scoreVotes({voteLike: 4, voteDislike: 3}, 0);
    expect(result).to.equal(0);
  });

  it('Should calculate score properly', async function() {
    let result = scoreVotes({voteLike: 6, voteShrug: 4, voteDislike: 3}, 13);
    let score = (6 - 0.5 * 3) / 13;
    expect(result).to.equal(score / 0.6);
  });
});

describe('hasWinningScore Test', async function() {
  it('Should return false if below threshold', async function() {
    let result1 = hasWinningScore(1);
    expect(result1).to.equal(false);

    let result2 = hasWinningScore(0.63);
    expect(result2).to.equal(false);

    let result3 = hasWinningScore(-0.2);
    expect(result3).to.equal(false);
  });

  it('Should return true if above threshold', async function() {
    let result1 = hasWinningScore(1.0001);
    expect(result1).to.equal(true);

    let result2 = hasWinningScore(1.4);
    expect(result2).to.equal(true);
  });

  it('Should return false for null values', async function() {
    let result = hasWinningScore(null);
    expect(result).to.equal(false);
  });
});