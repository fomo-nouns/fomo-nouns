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
                    }
                }`
        }
    });
    const currentEndTimeUnix = parseInt(lastData.data.data.auction.endTime);

    if (true) {
        // if (currentEndTimeUnix == auction.endTimeUnix) {
    } else if (currentEndTimeUnix > (auction.endTimeUnix + 10)) {
        auction.missedMarginally = true;
    } else {
        auction.toEndInTime = false;
        auction.endTimeUnix = currentEndTimeUnix;
        auction.endTimeISO = new Date((currentEndTimeUnix - 10) * 1000).toISOString();
    }

    return {
        auction: auction,
    };
};
