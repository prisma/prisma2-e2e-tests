# Prisma e2e Tests

| CI Status                                                                                                                                                                                      | Branch        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [![test dev](https://github.com/prisma/e2e-tests/workflows/test/badge.svg?branch=dev)](https://github.com/prisma/e2e-tests/actions?query=workflow%3Atest+-branch%3Apatch-dev+branch%3Adev) <!-- Attention: The `patch-dev` here is intentional, it is _filtering out_ the `patch-dev` branch - otherwise this link will show runs both for `dev` _and_ `patch-dev`. GitHub unfortunately has a (reported) bug in display the filter in the resulting page, so it look as if we were filtering _for_ `patch-dev`. The results are correct though. --> | `dev` |
| [![test latest](https://github.com/prisma/e2e-tests/workflows/test/badge.svg?branch=latest)](https://github.com/prisma/e2e-tests/actions?query=workflow%3Atest+branch%3Alatest)                | `latest`      |
| [![test patch-dev](https://github.com/prisma/e2e-tests/workflows/test/badge.svg?branch=patch-dev)](https://github.com/prisma/e2e-tests/actions?query=workflow%3Atest+branch%3Apatch-dev)       | `patch-dev`   |
| [![test integration](https://github.com/prisma/e2e-tests/workflows/test/badge.svg?branch=integration)](https://github.com/prisma/e2e-tests/actions?query=workflow%3Atest+branch%3Aintegration) | `integration` |
| [![check-for-update](https://github.com/prisma/e2e-tests/workflows/check-for-update/badge.svg)](https://github.com/prisma/e2e-tests/actions?query=workflow%3Acheck-for-update)                 | -             |

This repository continuously tests Prisma Client on various operating systems, frameworks and platforms.

You can check out the latest test runs by checking the ["test" workflow results](https://github.com/prisma/e2e-tests/actions?query=workflow%3Atest).

## How it works

### Dependency Updates

Renovate is enabled for this repository for all dependencies except `prisma` and `@prisma/client`. Our own script handles upgrading prisma-related dependencies since Renovate is too slow for our use case.

### Prisma Updates

If there is a new version, [Prismo](https://github.com/prisma-bot) works tirelessly to commit and push a bump commit, triggering the e2e tests. This is implemented in `.github/workflows/check-for-update.yaml` using a GitHub Action cron job. Since the cron job is limited to run each 5 minutes, we just run each cron job for exactly 5 minutes and check for updates each 10 seconds in each run. This check only runs in the default branch `dev`.

### Branches and npm channels

The default `dev` branch of this repository contains the examples with the development version of Prisma CLI and Prisma Client (`@dev` on npm). These dependencies are kept up to date with a GitHub Action workflow, which updates them every time a new version of Prisma is released.

There are also the branches `latest` and `patch-dev`, which mirror the code from `dev` (synced via a GitHub Action workflow), but they use the respective development channels of Prisma CLI and Prisma Client from npm instead (`@latest` and `@patch-dev`, also updated via a GitHub Action workflow). Thanks to the test coverage of all projects, this can point us to incompatibilities early.

### e2e Tests

The e2e tests are defined in `.github/workflows/test.yaml`. Currently, this action tests:

- Operating Systems: Linux, Mac, Windows (see `generic/`)
- Node versions: 12, 14 (see `generic/`)
- Frameworks (see `frameworks/`)
- Cloud platforms (see `platforms/`)
- Bundlers (see `bundlers/`)
- Miscellaneous database tools and platform combinations (see `databases/`)
- Package managers or specific package manager setups or features (see `packagers/`)

### Checking Test Results

To check the current status of this repository somewhere else, you can use [a simple shell script](https://gist.github.com/steebchen/80fb6e3a60aec0f095090618f90473ec).

## Contributing

We use [conventional commits](https://www.conventionalcommits.org) (also known as semantic commits) to ensure consistent and descriptive commit messages.

## Development Workflow

We develop directly against GitHub Actions. The workflow looks like this:

1. Checkout a branch
2. Make your changes
3. Push your changes to a PR on GitHub
4. Inspect the running Checks

### How to add or adapt platforms

First add a matrix run entry in `.github/workflows/test.yaml` under the category the project falls into. For example, if you're adding a new platform into the `platforms` folder, put a new line named after your project folder in `.github/workflows/test.yaml` under `jobs.platforms.strategy.matrix.platform`.

Then in your project, create a file `run.sh` and use it as an entrypoint to set up your projects. This includes installing dependencies, deploying etc.

Then in your project, create a file `test.sh` and use it as and entrypoint to run your tests. Please write POSIX-compliant scripts (not bash) and use the the following template for all of your sh files to make sure they exit on errors (`-e`) and undefined variables (`-u`):

```shell script
#!/bin/sh

set -eux

# ...
```

**Note:** You need to use [yarn](https://yarnpkg.com) as it's used for bumping dependencies; i.e. run `yarn install` as a first step in your `run.sh` script.

If you need additional dependencies such as CLIs, you can install them in the optional `prepare.sh` in a specific folder. It will automatically be picked up to run before the `run.sh` file does.

**Note:** It's important to add `prisma` as a devDependency and `@prisma/client` as a normal dependency in each project's `package.json`.

