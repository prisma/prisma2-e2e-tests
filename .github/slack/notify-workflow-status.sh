#!/bin/bash

set -eu
shopt -s inherit_errexit || true

emoji="$1"

if [ "$GITHUB_REF" = "refs/heads/dev" ] || [ "$GITHUB_REF" = "refs/heads/integration" ] || [ "$GITHUB_REF" = "refs/heads/patch-dev" ] || [ "$GITHUB_REF" = "refs/heads/latest" ]; then

  (cd .github/slack/ && yarn install --silent)

  version="$(cat .github/prisma-version.txt)"
  branch="$(git rev-parse --abbrev-ref HEAD)"
  sha="$(git rev-parse HEAD)"
  short_sha="$(echo "$sha" | cut -c -7)"
  message="$(git log -1 --pretty=%B | head -n 1)"

  commit_link="\`<https://github.com/prisma/e2e-tests/commit/$sha|$branch@$short_sha>\`"
  workflow_link="<https://github.com/prisma/e2e-tests/actions/runs/$GITHUB_RUN_ID|$message>"

  export webhook="$SLACK_WEBHOOK_URL_WORKFLOWS"
  node .github/slack/notify.js "prisma@$version: $emoji $workflow_link (via $commit_link)"

fi