import { contract as AuctionContract } from '../wrappers/nounsAuction';

const settleMethods = ['settleCurrentAndCreateNewAuction', 'settleAuction']
const bidMethod = 'createBid'

export const isSettleMethod = (input: string) => {
    try {
        const decodedInput = AuctionContract.interface.parseTransaction({ data: input })
        return settleMethods.includes(decodedInput.name);
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