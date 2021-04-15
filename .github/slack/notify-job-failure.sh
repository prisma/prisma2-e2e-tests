#!/bin/sh

set -eu
shopt -s inherit_errexit || true

dir=$1
project=$2
set +u
matrix=$3
set -u

if [ "$GITHUB_REF" = "refs/heads/dev" ] || [ "$GITHUB_REF" = "refs/heads/integration" ] || [ "$GITHUB_REF" = "refs/heads/patch-dev" ] || [ "$GITHUB_REF" = "refs/heads/latest" ]; then

  (cd .github/slack/ && yarn install --silent)

  version="$(cat .github/prisma-version.txt)"
  branch="${GITHUB_REF##*/}"
  sha="$(git rev-parse HEAD | cut -c -7)"
  short_sha="$(echo "$sha" | cut -c -7)"
  commit_link="\`<https://github.com/prisma/e2e-tests/commit/$sha|$branch@$short_sha>\`"
  workflow_link="<https://github.com/prisma/e2e-tests/actions/runs/$GITHUB_RUN_ID|$project $matrix>"

  echo "notifying failing slack channel"
  export webhook="$SLACK_WEBHOOK_URL_FAILING"
  node .github/slack/notify.js "prisma@$version: :x: $workflow_link failed (via $commit_link)"

fi
