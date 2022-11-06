# FOMO Nouns Backend

## Overview

This has the code and deployment infrastructure for the FOMO Nouns backend. This backend allows users to connect via websocket, votes to be submitted and stored in a DynamoDB table, and when a quorum of votes likes a Noun, launches settlement on the FOMO Nouns contract.

Dependencies:

- AWS Account with Appropriate IAM Accesses
- AWS CLI
- Alchemy API Key & Ethereum Account with ETH
- Google Cloud account with ReCaptcha v3 Enterprise Enabled
- Score based ReCaptcha API Key

## Setup

First, ensure you've completed the global setup instructions in the root README.

### 1. Setup AWS CLI and SAM CLI

First, install the AWS CLI ([instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)). Then, configure the CLI with your AWS account information and keys ([instructions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)). Finally, install the SAM CLI ([instructions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)).

### 2. Store private keys in AWS Secrets Manager

Run `key-management.sh` script to store:

1. Alchemy API key
2. Ethereum Executor Account private key
3. Google Cloud Project API key
4. ReCaptcha key (Score based)

in AWS Secrets Manager:

```
./key-management.sh --set --alchemy "<YOUR_PRIVATE_KEY>"
./key-management.sh --set --executor "0x<YOUR_PRIVATE_KEY>"
./key-management.sh --set --google-api-key "<YOUR_API_KEY>"
./key-management.sh --set --recaptcha-key "<YOUR_RECAPTCHA_KEY>"
```

If you deploy to non standard AWS region (us-east-2), you may specify region after `key` value:

```
./key-management.sh --set --alchemy "<YOUR_PRIVATE_KEY>" <YOUR_AWS_REGION>
```

### 2.1 Set the project ENV variables

TODO: finish the section 2.1

1. Set the Google Cloud Project Id
2. ReCaptcha Action specified in ReCaptcha call
3. ReCaptcha threshold (0.0-1.0)*

(*) This is used to determine when to restrict access to backend. In ReCaptcha score 0.0 is highest risk, 1.0 is lowest risk. Setting threshold to 0.0 will allow bots to send votes, setting to 1.0 will allow only most reCaptcha trusted and legitimate "users" to be able to send votes. Setting to 1.0 may limit other actual (and legitimate) users from sending votes ([learn more](https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment?authuser=6#interpret_scores)). Set this value according to analytics.

### 3. Build and Deploy

Run `sam build` in this folder to build the project, and then deploy using `sam deploy --guided`. After walking through some configuration and naming options, this will deploy all the components needed for the backend. Any changes can be redeployed by using the stack name you chose using `sam deploy --stack-name <name_here>`.

The final step of the deployment should show **Outputs** with one of the keys being **WebSocketURI**. Note down the value for this key that should look something like `wss://a1b2c3.execute-api.us-east-1.amazonaws.com/Prod`

### 4. Test

**Basic Test**

Using the `wss://` URL above, run the command `wscat -c wss://<URL>` to open a websocket connection. You should see something like:

```
Connected (press CTRL+C to quit)
>
```

Pass an example payload like the one below:

```
{"action": "sendvote", "nounId": "1234", "blockhash": "abcd1234", "vote": "voteLove"}
```

You should see a response from the websocket echoing the vote:

```
< voteLove
```

If so, you've successfully deployed the backend.

**Settlment Test**

The full voting quorum and settlement can be tested using the integrat-test script using:

```
node integration-test/test-settle.js wss://<URL>
```

This script will simulate connecting four users via websocket who vote, and if quorum is achieved, settlement will be launched.
