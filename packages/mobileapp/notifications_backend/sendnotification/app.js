// SPDX-License-Identifier: MIT-0

const fbAdmin = require("firebase-admin");
const serviceAccount = require("serviceAccount.json");

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
});

const CASES = {
  ON_END: "onAuctionEnd",
  TEN_MIN_BEFORE_END: "tenMinutesBeforeEnd",
  FIVE_MIN_BEFORE_END: "fiveMinutesBeforeEnd",
};

exports.handler = (event, context, callback) => {
  var auction = event.auction;

  const fcm = fbAdmin.messaging();

  const topic = auction.topic;

  var title;
  var body;
  var interruptionLevel;

  switch (topic) {
    case CASES.ON_END:
      title = "Fomo Nouns is starting!";
      body = "Let's gooooo selecting the next noun!";
      interruptionLevel = "time-sensitive";
      break;
    case CASES.TEN_MIN_BEFORE_END:
      title = "Auction is about to end in 10 minutes!";
      body =
        "Prepare the guns for Fomo! But don't forget it may take more time to end.";
      interruptionLevel = "active";
      break;
    case CASES.FIVE_MIN_BEFORE_END:
      title = "Auction is about to end in 5 minutes!";
      body =
        "Prepare the guns for Fomo! But don't forget it may take more time to end.";
      interruptionLevel = "active";
      break;
  }

  var message = {
    notification: {
      title: title,
      body: body,
    },
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          "interruption-level": interruptionLevel,
        },
      },
    },
    topic: topic,
  };

  // Send a message.
  fcm
    .send(message)
    .then((res) => {
      // Response is a message ID string.
      const response = {
        statusCode: 200,
        body: "Successfully sent message: " + JSON.stringify(res),
      };
      callback(null, response);
    })
    .catch((err) => {
      callback(null, err);
    });
};
