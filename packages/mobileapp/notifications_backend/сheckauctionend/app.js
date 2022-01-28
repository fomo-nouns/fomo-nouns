// SPDX-License-Identifier: MIT-0

const axios = require("axios");

const SUBGRAPH_API = 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph';

exports.handler = async event => {
    var auction = event.auction;

    const lastData = await axios({
        url: SUBGRAPH_API,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            query: `
                query{
                    auction(id: ${auction.id}) {
                        endTime
                        settled
                    }
                }`
        }
    });
    const currentEndTimeUnix = parseInt(lastData.data.data.auction.endTime);
    const auctionSettled = lastData.data.data.auction.settled;

    const currentUnix = Math.floor(Date.now() / 1000);

    if (currentUnix <= (currentEndTimeUnix + 20) && !auctionSettled) {
        if (currentEndTimeUnix == auction.endTimeUnix && !auction.toEndInTime) {
            auction.toEndInTime = true;
        } else if (currentEndTimeUnix > auction.endTimeUnix) {
            auction.toEndInTime = false;
            auction.endTimeUnix = currentEndTimeUnix;
            auction.endTimeISO = new Date((currentEndTimeUnix + 5) * 1000).toISOString();
        }
    } else {
        auction.missedMarginally = true;
    }

    return {
        auction: auction,
    };
};
