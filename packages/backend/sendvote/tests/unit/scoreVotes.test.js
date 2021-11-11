const { expect } = require('chai');
const { hasWinningVotes } = require('../../utils/scoreVotes');


describe('hasWinningVotes Test', async function() {

  describe('Single Vote', async function() {
    it('Like vote should WIN', async function() {
      let result = hasWinningVotes({voteLove: 1}, 1);
      expect(result).to.be.true;
    });

    it('Love vote should WIN', async function() {
      let result = hasWinningVotes({voteLike: 1}, 1);
      expect(result).to.be.true;
    });

    it('Dislike vote should LOSE', async function() {
      let result = hasWinningVotes({voteDislike: 1}, 1);
      expect(result).to.be.false;
    });

    it('Hate vote should LOSE', async function() {
      let result = hasWinningVotes({voteHate: 1}, 1);
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
    it('Should ignore dislikes', async function() {
      let result = hasWinningVotes({voteLike: 61, voteDislike: 1}, 100);
      expect(result).to.be.true;
    });

    it('Should let 1 hate vote counteract 1 like', async function() {
      let result = hasWinningVotes({voteLike: 61, voteHate: 1}, 100);
      expect(result).to.be.false;
    });

    it('Should let 2 love vote count as much as 3 like', async function() {
      let result = hasWinningVotes({voteLike: 58, voteLove: 2}, 100); // 61 total
      expect(result).to.be.true;
    });
  });  
});