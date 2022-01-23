
# Setting up Firebase Admin to be used in AWS Lambda

To enable notifications send you'll need Firebase service acoount key

1. Open your Firebase project -> Project Settings -> Service Accounts

2. Click "Generate new private key" and download the json file

3. Rename it to `serviceAccount.json` and put inside `SendNotification\` folder. *Remark: This file is not version controlled*

## Required roles

1. `notificationreqiest` lambda requires `Step Function` \ `StartExecution` role.

2. step function requires `Lambda` \ `InvokeFunction` role.
