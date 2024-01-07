#!/usr/bin/env bash

set -e

CLOUDFLARE_KV_NAME=$1

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
  elif [[ -z "$CLOUDFLARE_KV_NAME" ]]; then
    echo "Arg 1 for script 'CLOUDFLARE_KV_NAME' was not given..."
    exit 1
  fi
}

function main() {
  check_requirements

  if ./node_modules/.bin/wrangler kv:namespace list | grep -q "$CLOUDFLARE_KV_NAME"; then
    echo -e "\nCloudflare KV '$CLOUDFLARE_KV_NAME' already exists...\n"
  else
    echo "Cloudflare KV '$CLOUDFLARE_KV_NAME' does not exist..."
    ./node_modules/.bin/wrangler kv:namespace create "$CLOUDFLARE_KV_NAME"
  fi
}

main
