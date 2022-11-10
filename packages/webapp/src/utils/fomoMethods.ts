import { contract as FomoContract } from '../wrappers/fomoSettlement';

const settleMethods = ['settleAuctionWithRefund', 'settleAuction']

export const isSettleMethod = (input: string) => {
    try {
        const decodedInput = FomoContract.interface.parseTransaction({ data: input })
        return settleMethods.includes(decodedInput.name);
    } catch {
        return false;
    }
};