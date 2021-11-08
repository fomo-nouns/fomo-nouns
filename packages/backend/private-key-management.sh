#!/bin/bash

DESCRIPTION="Ethereum private key with Executor rights to the FOMO Nouns Contract"

if [[ "$1" == "--set" ]]; then
  aws secretsmanager create-secret --name nouns/ExecutorPrivateKey --description "$DESCRIPTION" --secret-string $2
elif [[ "$1" == "--get" ]]; then
  if [[ -z "$2" ]]; then
    aws secretsmanager describe-secret --secret-id nouns/ExecutorPrivateKey
  else
    aws secretsmanager describe-secret --secret-id "$2"
  fi
else
  echo '''Script can be run with two commands:
    ./private-key-management.sh --set <private_key>
      - Stores a new private key for execution

    ./private-key-management.sh --get
      - Gets the description of currently stored key'''
fi