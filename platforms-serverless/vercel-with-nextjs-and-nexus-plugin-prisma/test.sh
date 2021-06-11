#!/bin/sh
set -eu

yarn start &
pid=$!

sleep 10

actual="$(curl 'https://e2e-vercel-with-nextjs-and-nexus-plugin-prisma.vercel.app/api/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: https://e2e-vercel-with-nextjs-and-nexus-plugin-prisma.vercel.app' --data-binary '{"query":"query {\n  users {\n    id, name\n  }\n}"}' --compressed)"

expected='{"data":{"users":{"result":"[{\"id\":7,\"email\":\"john@example.com\",\"name\":\"John Doe\"}]"}}}'

if [ "$expected" != "$actual" ]; then
  echo "expected '$expected', got '$actual'"
  kill $pid
  exit 1
fi

echo "result: $actual"

kill $pid
