const {TwitterClient} = require('twitter-api-client');

const twitterClient = new TwitterClient( {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET 
});

exports.handler = async(event, context) => {
    const queryParams = event.queryStringParameters;
    let nounId = queryParams['id'];
    const params = {
        q: `from:nounsbot_ bleep ${nounId}`,
        include_entities: true
    };

    const tweets = await twitterClient.tweets.search(params);
    const auctionStartTweet = tweets.statuses[0];
    const media = auctionStartTweet.entities.media;
    const pictureUrl = media[0].display_url;
    return {
        statusCode: 200,
        body: JSON.stringify({mediaUrl: pictureUrl}),
        
    }
}