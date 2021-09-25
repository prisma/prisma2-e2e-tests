#!/bin/bash

set -eu
shopt -s inherit_errexit || true

packageJSONDir="$1"

echo "-------------------------"
echo ""

echo "node: $(node -v) ($(node -p process.arch))"
echo "npm: $(npm -v)"

echo "prisma-version.txt: $(cat .github/prisma-version.txt)"
echo "prisma (package.json): $(jq .devDependencies[\"prisma\"] < $packageJSONDir)"
echo "@prisma/client (package.json): $(jq .dependencies[\"@prisma/client\"] < $packageJSONDir)"

echo ""
echo "-------------------------"
