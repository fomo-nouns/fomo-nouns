// SPDX-License-Identifier: MIT-0

const fbAdmin = require('firebase-admin');
const serviceAccount = require("serviceAccount.json");

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount)
});

const CASES = {
    ON_END: 'onAuctionEnd',
    TEN_MIN_BEFORE_END: '10minutesBeforeEnd',
    FIVE_MIN_BEFORE_END: '5minutesBeforeEnd'
};

exports.handler = (event, context, callback) => {
    var auction = event.auction;

    const fcm = fbAdmin.messaging();

    const topic = auction.topic;

    var message;

    switch (topic) {
        case CASES.ON_END:
            message = {
                notification: {
                    title: 'Fomo Nouns is starting!',
                    body: "Let's gooooo selecting the next noun!"
                },
            };
            break;
        case CASES.TEN_MIN_BEFORE_END:
            message = {
                notification: {
                    body: "Prepare the guns for Fomo! But don't forget it may take more time to end."
                },
                android: {
                    notification: {
                        title: 'Nouns auction is about to end in 10 minutes!',
                    }
                },
                apns: {
                    notification: {
                        title: 'Auction is about to end in 10 minutes!',
                    }
                },
            };
            break;
        case CASES.FIVE_MIN_BEFORE_END:
            message = {
                notification: {
                    body: "Prepare the guns for Fomo! But don't forget it may take more time to end."
                },
                android: {
                    notification: {
                        title: 'Nouns auction is about to end in 5 minutes!',
                    }
                },
                apns: {
                    notification: {
                        title: 'Auction is about to end in 5 minutes!',
                    }
                },
            };
            break;
    }

    // Send a message to devices subscribed to the provided topic.
    fcm.sendToTopic(topic, message)
        .then((res) => {
            // Response is a message ID string.
            const response = {
                statusCode: 200,
                body: 'Successfully sent message: ' + JSON.stringify(res)
            };
            callback(null, response);
        })
        .catch((err) => {
            callback(null, err);
        });
};
