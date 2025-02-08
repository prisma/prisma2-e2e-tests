#!/bin/sh

set -eu

dir=$1
project=$2
set +u
matrix=$3
set -u

if [ "$GITHUB_REF" = "refs/heads/dev" ] || [ "$GITHUB_REF" = "refs/heads/integration" ] || [ "$GITHUB_REF" = "refs/heads/patch-dev" ] || [ "$GITHUB_REF" = "refs/heads/latest" ]; then
  branch="${GITHUB_REF##*/}"
  sha="$(git rev-parse HEAD | cut -c -7)"
  short_sha="$(echo "$sha" | cut -c -7)"
  commit_link="\`<https://github.com/prisma/ecosystem-tests/commit/$sha|$branch@$short_sha>\`"
  workflow_link=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/jobs" | jq -rj ".jobs[] | select(.name==\"$GITHUB_JOB\") | .html_url")

  export webhook="$SLACK_WEBHOOK_URL"
  version="$(cat .github/prisma-version.txt)"
  sha="$(git rev-parse HEAD | cut -c -7)"

  emoji=":x:"

  export webhook="$SLACK_WEBHOOK_URL_FAILING"
  echo "notifying failing slack channel"
  node .github/slack/notify.js "prisma@$version: ${emoji} $workflow_link failed (via $commit_link)"
fi
