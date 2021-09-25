#!/bin/sh

set -eux

yarn start &
pid=$!

sleep 30

prismaVersion=$(sh ../../utils/prisma_version.sh)

# TODO check for engine files
expected="{\"prismaVersion\":\"$prismaVersion\",\"createUser\":{\"name\":\"Alice\"},\"updateUser\":{\"name\":\"Bob\"},\"deleteUser\":{\"name\":\"Bob\"},\"files\":\"TODO\"}"
actual=$(curl localhost:3000)

if [ "$expected" != "$actual" ]; then
  echo "expected '$expected', got '$actual'"
  kill $pid
  exit 1
fi

echo "result: $actual"

kill $pid
