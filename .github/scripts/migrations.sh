#!/bin/bash

set -eu
shopt -s inherit_errexit || true

export CI=true

database=$1

# In platforms/firebase-functions, the file exists in /functions sub-directory, so we can't hardcode the package.json path
pjson_path=$(find migrations -name "package.json" ! -path "*/node_modules/*" | head -n 1)
bash .github/scripts/print-version.sh $pjson_path

cd .github/slack/
yarn install
cd ../..

root=$(pwd)

cd "migrations"
yarn install
echo "> yarn prisma -v"
yarn prisma -v
echo "> yarn prisma db push --preview-feature"
yarn prisma db push --preview-feature
code=$?

echo "done"

cd "$root"

if [ "$GITHUB_REF" = "refs/heads/dev" ] || [ "$GITHUB_REF" = "refs/heads/integration" ] || [ "$GITHUB_REF" = "refs/heads/patch-dev" ] || [ "$GITHUB_REF" = "refs/heads/latest" ]; then
  (cd .github/slack/ && yarn install --silent)

  branch="${GITHUB_REF##*/}"
  sha="$(git rev-parse HEAD | cut -c -7)"
  short_sha="$(echo "$sha" | cut -c -7)"
  commit_link="\`<https://github.com/prisma/e2e-tests/commit/$sha|$branch@$short_sha>\`"
  workflow_link="<https://github.com/prisma/e2e-tests/actions/runs/$GITHUB_RUN_ID|$project $matrix>"

  export webhook="$SLACK_WEBHOOK_URL"
  version="$(cat .github/prisma-version.txt)"
  sha="$(git rev-parse HEAD | cut -c -7)"

  emoji=":warning:"
  if [ $code -eq 0 ]; then
    emoji=":white_check_mark:"
  fi

  echo "notifying slack channel"
  node .github/slack/notify.js "prisma@$version: ${emoji} $workflow_link ran (via $commit_link)"

  if [ $code -ne 0 ]; then
    export webhook="$SLACK_WEBHOOK_URL_FAILING"
    echo "notifying failing slack channel"
    node .github/slack/notify.js "prisma@$version: ${emoji} $workflow_link failed (via $commit_link)"
  fi
fi

echo "exitting with code $code"
exit $code
