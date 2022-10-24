#!/bin/bash

ACTION="$1"
SECRET="$3"
REGION="$4"

if [[ "$2" == "--alchemy" ]]; then
  NAME="nouns/AlchemyKey"
  DESCRIPTION="Alchemy API key"
elif [[ "$2" == "--executor" ]]; then
  NAME="nouns/ExecutorPrivateKey"
  DESCRIPTION="Ethereum private key with Executor rights to the FOMO Nouns Contract"
elif [[ "$2" == "--google-api-key" ]]; then
  NAME="nouns/GoogleApiKey"
  DESCRIPTION="ReCaptcha: API key associated with the Google Cloud project"
elif [[ "$2" == "--google-project-id" ]]; then
  NAME="nouns/GoogleProjectId"
  DESCRIPTION="ReCaptcha: Google Cloud project ID"
elif [[ "$2" == "--recaptcha-key" ]]; then
  NAME="nouns/ReCaptchaKey"
  DESCRIPTION="ReCAPTCHA key associated with the site/app"
elif [[ "$2" == "--recaptcha-action" ]]; then
  NAME="nouns/ReCaptchaAction"
  DESCRIPTION="ReCAPTCHA: the user-initiated action specified in ReCaptcha call"
elif [[ "$2" == "--recaptcha-threshold" ]]; then
  NAME="nouns/ReCaptchaThreshold"
  DESCRIPTION="ReCAPTCHA: threshold to determine when to restrict access to backend"
else
  ACTION=""
fi

if [ -z "$REGION" ]; then 
  REGION="us-east-2"
fi

if [[ "$ACTION" == "--set" ]]; then
  aws secretsmanager create-secret --name "$NAME" --description "$DESCRIPTION" --secret-string "$SECRET" --region "$REGION"
elif [[ "$ACTION" == "--update" ]]; then
  aws secretsmanager update-secret --secret-id "$NAME" --secret-string "$SECRET" --region "$REGION"
elif [[ "$ACTION" == "--get" ]]; then
  aws secretsmanager describe-secret --secret-id "$NAME" --region "$REGION"
else
  echo '''The script can be run with the following commands:
    ./key-management.sh --set --executor/--alchemy <private_key>
      * Create the new private key storage

    ./key-management.sh --update --executor/--alchemy <private_key>
      * Updates the existing stored private key

    ./key-management.sh --get --executor/--alchemy
      * Gets the description of currently stored key'''
fi