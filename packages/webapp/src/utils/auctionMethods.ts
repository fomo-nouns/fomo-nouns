import { contract as AuctionContract } from '../wrappers/nounsAuction';

const settleMethod = 'settleCurrentAndCreateNewAuction'
const bidMethod = 'createBid'

const decodeMethod = (input: string) => {
    const decodedInput = AuctionContract.interface.parseTransaction({ data: input })
    return decodedInput.name
}

export const isSettleMethod = (input: string) => {
    try {
        return decodeMethod(input) === settleMethod;
    } catch {
        return false;
    }
};

export const isBidMethod = (input: string) => {
    try {
        return decodeMethod(input) === bidMethod;
    } catch {
        return false;
    }
};