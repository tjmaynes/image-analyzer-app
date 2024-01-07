#!/usr/bin/env bash

set -e

CLOUDFLARE_KV_BINDING_ID=$1
CLOUDFLARE_KV_KEY=$2
CLOUDFLARE_KV_VALUE=$3

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
  elif [[ -z "$CLOUDFLARE_KV_BINDING_ID" ]]; then
    echo "Arg 1 for script 'CLOUDFLARE_KV_BINDING_ID' was not given..."
    exit 1
  elif [[ -z "$CLOUDFLARE_KV_KEY" ]]; then
    echo "Arg 2 for script 'CLOUDFLARE_KV_KEY' was not given..."
    exit 1
  elif [[ -z "$CLOUDFLARE_KV_VALUE" ]]; then
    echo "Arg 3 for script 'CLOUDFLARE_KV_VALUE' was not given..."
    exit 1
  fi
}

function main() {
  check_requirements

  if ! ./node_modules/.bin/wrangler kv:key get "$CLOUDFLARE_KV_KEY" --namespace-id="$CLOUDFLARE_KV_BINDING_ID" > /dev/null 2>&1; then
    echo "Adding Cloudflare KV key '$CLOUDFLARE_KV_KEY' and value '$CLOUDFLARE_KV_VALUE' to KV '$CLOUDFLARE_KV_NAME'..."
    ./node_modules/.bin/wrangler kv:key put "$CLOUDFLARE_KV_KEY" "$CLOUDFLARE_KV_VALUE" --namespace-id="$CLOUDFLARE_KV_BINDING_ID"
  fi
}

main
