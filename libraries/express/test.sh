#!/bin/sh

set -eux

yarn start &
pid=$!

sleep 10

curl "http://localhost:3000/ensure-user"

expected='[{"id":1,"email":"john@example.com","name":"John Doe"}]'
actual=$(curl "http://localhost:3000/user")

if [ "$expected" != "$actual" ]; then
  echo "expected '$expected', got '$actual'"
  kill $pid
  exit 1
fi

echo "result: $actual"

kill $pid
