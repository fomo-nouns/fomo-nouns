
const CASES = {
    ON_END: 'onAuctionEnd',
    TEN_MIN_BEFORE_END: '10minutesBeforeEnd',
    FIVE_MIN_BEFORE_END: '5minutesBeforeEnd'
};

exports.handler = async (event) => {
    var auction = event.auction;

    const endTimeUnix = parseInt(auction.endTimeUnix);

    switch (auction.topic) {
        case CASES.ON_END:
            auction.endTimeISO = new Date((endTimeUnix + 5) * 1000).toISOString();
            break;
        case CASES.TEN_MIN_BEFORE_END:
            auction.endTimeISO = new Date((endTimeUnix - 600) * 1000).toISOString();
            break;
        case CASES.FIVE_MIN_BEFORE_END:
            auction.endTimeISO = new Date((endTimeUnix - 300) * 1000).toISOString();
            break;
    }

    return { auction: auction };
};
