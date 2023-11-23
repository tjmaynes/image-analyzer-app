#!/usr/bin/env bash

set -e

PORT=$1

function check_requirements() {
  if [[ -z "$(command -v node)" ]]; then
    echo "Please install 'node' before running this script..."
    exit 1
  elif [[ -z "$PORT" ]]; then
    echo "Please pass a 'PORT' number as arg 1..."
    exit 1
  fi
}

function main() {
  check_requirements

  echo "Starting app on http://localhost:$PORT..."
  npm run start & npx wait-on "http://localhost:$PORT"

  npx @lhci/cli autorun
}

main
