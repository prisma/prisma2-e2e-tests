#!/bin/bash

set -eu
shopt -s inherit_errexit || true

cd .github/slack/
yarn install
cd ../..

npm i -g json

branch="$1"
version="$2"

echo ""
echo "=========================="
echo "upgrade-branch-to-version.sh"
echo "branch: $branch"
echo "version: $version"

echo ""
echo "=========================="
echo "setting up ssh repo"

mkdir -p ~/.ssh
echo "$SSH_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan github.com >> ~/.ssh/known_hosts

git config --global user.email "prismabots@gmail.com"
git config --global user.name "Prismo"

git remote add github "git@github.com:$GITHUB_REPOSITORY.git"
git fetch github "$branch"
git reset --hard "github/$branch"
git checkout "github/$branch"

# prepare script: read package.json but ignore some
pkg="var pkg=require('./package.json'); if (pkg.workspaces || pkg.name == '.prisma/client' || pkg.name == 'web') { process.exit(0); }"

# store pwd for later usage
dir=$(pwd)

packages=$(find . -not -path "*/node_modules/*" -type f -name "package.json")
echo "$packages" | tr ' ' '\n' | while read -r item; do
  echo "=========================="
  echo "checking $item"

  case "$item" in
  *"./package.json"* | *".github"* | *"functions/generated/client"*)
    echo "ignoring $item"
    continue
    ;;
  esac

  cd "$(dirname "$item")/"

  vCLI="$(node -e "$pkg;console.log(pkg.devDependencies['prisma'])")"

  if [ "$vCLI" != "" ]; then
    if [ "$version" != "$vCLI" ]; then
      echo "$item: prisma expected $version, actual $vCLI"
      echo "> yarn add \"prisma@$version\" --dev"
      yarn add "prisma@$version" --dev
    fi

    vPrismaClient="$(node -e "$pkg;console.log(pkg.dependencies['@prisma/client'])")"

    if [ "$version" != "$vPrismaClient" ]; then
      echo "$item: @prisma/client expected $version, actual $vPrismaClient"
      echo "> yarn add \"@prisma/client@$version\""
      yarn add "@prisma/client@$version"
    fi
  else
    echo "Dependency not found"
  fi

  cd "$dir"
done

echo ""
echo "=========================="
echo "after upgrade:"
git status

if [ -z "$(git status -s)" ]; then
  echo ""
  echo "=========================="
  echo "no changes, bye!"
  exit 0
fi
  
echo ""
echo "=========================="
echo "changes, upgrading..."
echo "$version" > .github/prisma-version.txt

git commit -am "chore(packages): bump prisma to $version (upgrade-branch-to-version.sh)"

set +e
git pull github "$branch" --rebase
code=$?
if [ $code -ne 0 ]; then
  export webhook="$SLACK_WEBHOOK_URL_FAILING"
  node .github/slack/notify.js "Prisma version $version :warning: Merge conflict at the end of upgrade-branch-to-version.sh script (via $branch)"
  exit 0
fi
set -e

set +e
git push github "HEAD:refs/heads/$branch"
code=$?
set -e
echo "pushed commit"

if [ $code -eq 0 ]; then
  export webhook="$SLACK_WEBHOOK_URL"
  node .github/slack/notify.js "Prisma version $version released (via $branch)"
  export webhook="$SLACK_WEBHOOK_URL_FAILING"
  node .github/slack/notify.js "Prisma version $version released (via $branch)"
fi

echo "done"
