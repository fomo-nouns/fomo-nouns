// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');
const axios = require('axios');

const SUBGRAPH_API = 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph';

const { STATE_MACHINE_ARN } = process.env;

const sf = new AWS.StepFunctions();

exports.handler = async (event, context, callback) => {
    // let body = JSON.parse(event.body);
    let body = event.body;

    var id;
    var endTimeUnix;
    var auctionSettled;

    try {
        const previousId = parseInt(body.previousAuctionId);
        id = (previousId % 10 == 9) ? previousId + 2 : previousId + 1;

        const auctionData = await axios({
            url: SUBGRAPH_API,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                query: `
                query{
                    auction(id: ${id}) {
                        endTime
                        settled
                    }
                }`
            }
        });
        endTimeUnix = parseInt(auctionData.data.data.auction.endTime);
        auctionSettled = auctionData.data.data.auction.settled;
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                "notificationRequested": false,
                "message": "Couldn't fetch data about auction",
                "error": JSON.stringify(err),
            })
        };

    }

    if (!auctionSettled) {
        const payload = {
            "auction": {
                "id": id,
                "endTimeUnix": endTimeUnix,
                "toEndInTime": true,
                "missedMarginally": false
            }
        };

        var sfParams = {
            stateMachineArn: STATE_MACHINE_ARN,
            input: JSON.stringify(payload)
        };

        try {
            await sf.startExecution(sfParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    "notificationRequested": true,
                    "message": 'Notification request recorded successfully',
                })
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    "notificationRequested": false,
                    "message": 'Failed to record notification request',
                    "error": JSON.stringify(err),
                })
            };
        }
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({
                "notificationRequested": false,
                "message": 'Specified auction already ended',
            })
        };
    }
};