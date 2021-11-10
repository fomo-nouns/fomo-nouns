#!/bin/bash

ACTION="$1"
SECRET="$3"

if [[ "$2" == "--alchemy" ]]; then
  NAME="nouns/AlchemyKey"
  DESCRIPTION="Alchemy API key"
elif [[ "$2" == "--executor" ]]; then
  NAME="nouns/ExecutorPrivateKey"
  DESCRIPTION="Ethereum private key with Executor rights to the FOMO Nouns Contract"
else
  ACTION=""
fi

if [[ "ACTION" == "--set" ]]; then
  aws secretsmanager create-secret --name "$NAME" --description "$DESCRIPTION" --secret-string "$SECRET"
elif [[ "ACTION" == "--update" ]]; then
  aws secretsmanager update-secret --secret-id "$NAME" --secret-string "$SECRET"
elif [[ "ACTION" == "--get" ]]; then
  aws secretsmanager describe-secret --secret-id "$NAME"
else
  echo '''The script can be run with the following commands:
    ./private-key-management.sh --set --executor <private_key>
                                --set --alchemy <private_key>
      - Create the new private key storage

    ./private-key-management.sh --update --executor <private_key>
                                --update --alchemy <private_key>
      - Updates the existing stored private key

    ./private-key-management.sh --get --executor
                                --get --alchemy <private_key>
      - Gets the description of currently stored key'''
fi