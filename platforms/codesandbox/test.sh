#!/bin/sh

set -eu

sandbox_id=$(cat sandbox_id)

url="https://$sandbox_id.sse.codesandbox.io"

expected='{"createUser":{"id":"12345","email":"alice@prisma.io","name":"Alice"},"updateUser":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"users":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"deleteManyUsers":{"count":1}}'
actual=$(curl -v "$url")

if [ "$expected" != "$actual" ]; then
	echo "expected '$expected', got '$actual'"
	exit 1
fi
