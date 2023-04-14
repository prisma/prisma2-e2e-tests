#!/bin/sh

set -eux

cd sub-project

pnpm test

if [ ! -f "pnpm-lock.yaml" ]; then
  echo "Test should have produced a pnpm-lock.yaml file"
  exit 1
fi

