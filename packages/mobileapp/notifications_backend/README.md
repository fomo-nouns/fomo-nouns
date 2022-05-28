# Back-end based on AWS Step-Function and Lambda functions

Used to deliver notifications before Nouns auctions end and on time it's ended

Uses:

- AWS Step-Functions
- AWS Lambda Functions
- AWS API Gateway
- Make(Integromat) Nouns package
- Graph endpoint for querying auction data

## Setting up Firebase Admin to be used in AWS Lambda

To enable notifications send you'll need Firebase service account key

1. Open your Firebase project -> Project Settings -> Service Accounts

2. Click "Generate new private key" and download the json file

3. Rename it to `serviceAccount.json` and put it inside `SendNotification\` folder. *Remark: This file is not version controlled*

## Lambda Functions

Make sure all 4 lambda functions:

- `notificationrequest/`
- `prepareisotime/`
- `sendnotification/`
- `checkauctionend/`

are deployed and have required layers.

## Step-Function

Deploy step function from `stepfunction/`

## Setting up API Gateway

Set up AWS API Gateway endpoint with POST call that will invoke `NotificationRequest` lambda function and pass to it `previousAuctionId` in the body.

## Setting up Make(Integromat) or Zapier

Now register on Make(Integromat) and using the [Nouns Package](https://verbs.notion.site/Nouns-Automations-using-Integromat-Zapier-7f3af840dc1d4a04b1d728f978c785b0) set up your automation to make `POST` call to created API endpoint with `previousAuctionId` in the body not later than 15 minutes before auction end.

## Required roles

1. `NotificationRequest` lambda function requires `Step Function` \ `StartExecution` role.

2. "Notifications" step function requires `Lambda` \ `InvokeFunction` role.

3. API Gateway requires `Lambda` \ `InvokeFunction` role.
