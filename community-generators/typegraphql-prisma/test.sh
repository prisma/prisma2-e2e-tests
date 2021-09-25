#!/bin/sh

set -eux

yarn start &
pid=$!

sleep 10

prismaVersion=$(sh ../../utils/prisma_version.sh)

expected="{\"data\":{\"users\":[],\"prismaVersion\":{\"version\":\"$prismaVersion\"}}}"
actual=$(curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"query {\n  users{\n    id\n    email\n    name\n  }\n  prismaVersion {\n    version\n  }\n}"}' --compressed)

if [ "$expected" != "$actual" ]; then
  echo "expected '$expected', got '$actual'"
  kill $pid
  exit 1
fi

echo "result: $actual"

kill $pid
