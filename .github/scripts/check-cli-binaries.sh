#!/bin/bash

echo "-------------- Checking CLI/Engines QE Binary --------------"
DIR=$1
PROJECT=$2

# These are skipping because they have different project structures
# TODO Adapt tests so they also work here, or adapt project to fit into the mold
skipped_projects=(
  aws-graviton # no local project at all (everything happens on server), so no `prisma` or `node_modules
  firebase-functions # no local project at expected location (but in `functions` subfolder) # TODO Why does `yarn prisma -v` return something in that directory though!?
)

case "${skipped_projects[@]}" in  *$2*)
  echo "Skipping as $2 is present in skipped_projects"
  exit 0
  ;;
esac

case $(uname | tr '[:upper:]' '[:lower:]') in
  linux*)
    os_name=linux
    ;;
  darwin*)
    os_name=osx
    ;;
  msys*)
    os_name=windows
    ;;
  *)
    os_name=windows
    ;;
esac
echo "Assumed OS: $os_name"

if [ -z ${PRISMA_FORCE_NAPI+x} ]; then
  echo "N-API:  Disabled"
  case $os_name in
    linux)
      qe_location="node_modules/@prisma/engines/query-engine-debian-openssl-1.1.x"
      qe_location2="node_modules/prisma/node_modules/@prisma/engines/query-engine-debian-openssl-1.1.x"
      ;;
    osx)
      qe_location="node_modules/@prisma/engines/query-engine-darwin"
      qe_location2="node_modules/prisma/node_modules/@prisma/engines/query-engine-darwin"
      ;;
    windows)
      qe_location="node_modules\@prisma\engines\query-engine-windows.exe"
      qe_location2="node_modules\prisma\node_modules\engines\query-engine-windows.exe"
      ;;
  esac
else
  echo "N-API: Enabled"
  case $os_name in
    linux)
      qe_location="node_modules/@prisma/engines/libquery_engine_napi-debian-openssl-1.1.x.so.node"
      qe_location2="node_modules/prisma/node_modules/@prisma/engines/libquery_engine_napi-debian-openssl-1.1.x.so.node"
      ;;
    osx)
      qe_location="node_modules/@prisma/engines/libquery_engine_napi-darwin.dylib.node"
      qe_location2="node_modules/prisma/node_modules/@prisma/engines/libquery_engine_napi-darwin.dylib.node"
      ;;
    windows*)
      qe_location="node_modules\@prisma\engines\query_engine_napi-windows.dll.node"
      qe_location2="node_modules\prisma\node_modules\engines\query_engine_napi-windows.dll.node"
      ;;
  esac
fi

echo "--- yarn prisma -v ---"
yarn -s prisma -v
echo "--- ls node_modules/@prisma/engines/ ---"
ls node_modules/@prisma/engines/
echo "--- ls node_modules/prisma/ ---"
ls node_modules/prisma/
echo "---"

# TODO Add test that makes sure not _wrong_ files are present as well
# Example: `community-generators (napi, prisma-dbml-generator)` has correct node_modules/prisma/libquery_engine_napi-debian-openssl-1.1.x.so.node, but wrong node_modules/@prisma/engines/query-engine-debian-openssl-1.1.x (also `community-generators (napi, prisma-json-schema-generator)`)
if [ -f "$qe_location" ]  || [ -f "$qe_location2" ] ; then
  echo "✔ Correct Query Engine exists"
else
  echo "❌ Could not find Query Engine in ${qe_location} or ${qe_location2} when using ${os_name}"
  exit 1
fi
