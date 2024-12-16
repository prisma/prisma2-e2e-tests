#!/bin/sh

set -eu

expected="[]"
actual=$(curl localhost:3000)

if [ "$expected" != "$actual" ]; then
  echo "expected '$expected', got '$actual'"
  docker stop $(docker ps -a -q)
  exit 1
fi

echo "result: $actual"
docker stop $(docker ps -a -q)
