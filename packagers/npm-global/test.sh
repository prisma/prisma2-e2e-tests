#!/bin/sh

set -eux

npm run cmd

prisma_version="$(cat ../../.github/prisma-version.txt)"
expected_version="$(prisma --version | grep -Po "prisma *?: \K(.*?)$")"

if [ "$expected_version" != "$prisma_version" ]; then
  echo "expected '$expected_version', got '$prisma_version'"
  exit 1
fi

echo "result: $prisma_version"
