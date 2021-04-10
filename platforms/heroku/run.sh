#!/bin/sh

set -eux

export PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms heroku build'
yarn install
yarn prisma generate

git config --global user.email "prismabots@gmail.com"
git config --global user.name "Prismo"

git init
git remote add heroku "https://ignored_user:`yarn --silent heroku auth:token`@git.heroku.com/e2e-platforms-heroku.git" || git remote set-url heroku "https://ignored_user:`yarn --silent heroku auth:token`@git.heroku.com/e2e-platforms-heroku.git" || true
git add .
git commit -m "push to heroku"
git push heroku master --force
rm -rf .git
