// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const { STATE_MACHINE_ARN } = process.env;

const sf = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {
    let body = JSON.parse(event.body.toString())

    const id = parseInt(body.previousAuctionId) + 1;
    const endTimeUnix = parseInt(body.endTimeUnix);

    const endTimeISO = new Date((endTimeUnix - 10) * 1000).toISOString();

    const payload = {
        "auction": {
            "id": id,
            "endTimeUnix": endTimeUnix,
            "endTimeISO": endTimeISO,
            "toEndInTime": true,
            "missedMarginally": false
        }
    };

    var sfParams = {
        stateMachineArn: STATE_MACHINE_ARN,
        input: JSON.stringify(payload)
    };

    sf.startExecution(sfParams, (err, data) => {
        if (err) {
            const response = {
                statusCode: 500,
                body: 'Failed to record notification request: ' + JSON.stringify(err)
            };
            callback(null, response);
        } else {
            const response = {
                statusCode: 200,
                body: 'Notification request recorded successfully'
            };
            callback(null, response);
        }
    });
};