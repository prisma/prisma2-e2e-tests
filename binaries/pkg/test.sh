#!/bin/sh

set -eux

os=""
filename="./prisma"

case $OS in
"ubuntu-20.04")
  os="linux"
  ;;
"macos-latest")
  os="macos"
  ;;
"windows-latest")
  os="win"
  filename="./prisma.exe"
  ;;
*)
  echo "no such os $OS"
  exit 1
  ;;
esac

pnpm exec pkg node_modules/prisma -t node18-$os

./$filename --version
