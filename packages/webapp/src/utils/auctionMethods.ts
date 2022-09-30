import { contract as AuctionContract } from '../wrappers/nounsAuction';

const settleMethod = 'settleCurrentAndCreateNewAuction'
const bidMethod = 'createBid'

export const isSettleMethod = (input: string) => {
    try {
        const decodedInput = AuctionContract.interface.parseTransaction({ data: input })
        return decodedInput.name === settleMethod;
    } catch {
        return false;
    }
};

export const isBidMethod = (input: string) => {
    try {
        const decodedInput = AuctionContract.interface.parseTransaction({ data: input })
        return decodedInput.name === bidMethod;
    } catch {
        return false;
    }
};