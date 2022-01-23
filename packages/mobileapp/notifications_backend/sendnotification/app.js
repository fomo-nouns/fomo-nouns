// SPDX-License-Identifier: MIT-0

const fbAdmin = require('firebase-admin');
const serviceAccount = require("serviceAccount.json");

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount)
});

exports.handler = (event, context, callback) => {
    var auction = event.auction;

    const fcm = fbAdmin.messaging();

    const topic = auction.topic;

    const message = {
        notification: {
            title: 'Fomo Nouns is starting!',
            body: 'Join to help us select the next noun.'
        },
    };

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
