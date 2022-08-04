/**
 * It takes in the number of dislikes and the total number of active players and returns the number of likes
 * needed to reach consensus
 * @param {number} dislikes - The number of dislikes noun received.
 * @param {number} players - The total number of active players.
 * @returns The number of votes needed to reach consensus.
 */
export const yesVotesNeeded = (dislikes: number, players: number) => {
    const winThreshold = 0.55;
  
    if (!players) {
      return 0;
    } else {
      return Math.ceil(winThreshold * players + 1/3 * dislikes);
    }
}