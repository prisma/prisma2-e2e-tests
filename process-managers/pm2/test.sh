#!/bin/sh

set -eux

expected="[]"
actual=$(curl localhost:3000)

if [ "$expected" != "$actual" ]; then
  echo "expected '$expected', got '$actual'"
  yarn pm2 stop 'prisma-pm2'
  exit 1
fi

echo "result: $actual"
yarn pm2 stop 'prisma-pm2'
