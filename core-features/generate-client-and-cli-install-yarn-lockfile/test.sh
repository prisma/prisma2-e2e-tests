#!/bin/sh

set -eux

if [ -f "pnpm-lock.yaml" ] || [ -f "package-lock.json" ]; then
  echo "Test should have produced a yarn.lock file only"
  exit 1
fi

yarn
yarn test
