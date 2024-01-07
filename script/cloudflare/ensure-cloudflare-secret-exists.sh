#!/usr/bin/env bash

set -e

CLOUDFLARE_WORKER_NAME=$1
CLOUDFLARE_SECRET_KEY=$2
CLOUDFLARE_SECRET_VALUE=$3

function check_requirements() {
  if [[ -z "$(command -v node)" ]]; then
    echo "Please install 'node' program before running this script"
    exit 1
  elif [[ -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
    echo "Please ensure environment variable 'CLOUDFLARE_ACCOUNT_ID' exists before running this script"
    exit 1
  elif [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
    echo "Please ensure environment variable 'CLOUDFLARE_API_TOKEN' exists before running this script"
    exit 1
  elif [[ -z "$CLOUDFLARE_WORKER_NAME" ]]; then
    echo "Arg 1 for script 'CLOUDFLARE_WORKER_NAME' was not given..."
    exit 1
  elif [[ -z "$CLOUDFLARE_SECRET_KEY" ]]; then
    echo "Arg 2 for script 'CLOUDFLARE_SECRET_KEY' was not given..."
    exit 1
  elif [[ -z "$CLOUDFLARE_SECRET_VALUE" ]]; then
    echo "Arg 3 for script 'CLOUDFLARE_SECRET_VALUE' was not given..."
    exit 1
  fi
}

function main() {
  check_requirements

  if ./node_modules/.bin/wrangler secret list --name "$CLOUDFLARE_WORKER_NAME" | grep -q "$CLOUDFLARE_SECRET_KEY"; then
    echo -e "\nCloudflare secret '$CLOUDFLARE_SECRET_KEY' already exists...\n"
  else
    echo "Cloudflare secret '$CLOUDFLARE_SECRET_KEY' does not exist..."
    echo "$CLOUDFLARE_SECRET_VALUE" | ./node_modules/.bin/wrangler secret put "$CLOUDFLARE_SECRET_KEY" --name "$CLOUDFLARE_WORKER_NAME"
  fi
}

main
