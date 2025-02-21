# Prisma Ecosystem Tests

This repository continuously tests Prisma Client on and with various operating systems, databases, frameworks, platforms and other setups.

| CI Status                                                                                                                                                                                      | Branch        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [![test dev](https://github.com/prisma/ecosystem-tests/workflows/test/badge.svg?branch=dev)](https://github.com/prisma/ecosystem-tests/actions?query=workflow%3Atest+branch%3Adev) | `dev` |
| [![test latest](https://github.com/prisma/ecosystem-tests/workflows/test/badge.svg?branch=latest)](https://github.com/prisma/ecosystem-tests/actions?query=workflow%3Atest+branch%3Alatest)                | `latest`      |
| [![test patch-dev](https://github.com/prisma/ecosystem-tests/workflows/test/badge.svg?branch=patch-dev)](https://github.com/prisma/ecosystem-tests/actions?query=workflow%3Atest+branch%3Apatch-dev)       | `patch-dev`   |
| [![test integration](https://github.com/prisma/ecosystem-tests/workflows/test/badge.svg?branch=integration)](https://github.com/prisma/ecosystem-tests/actions?query=workflow%3Atest+branch%3Aintegration) | `integration` |
| [![check-for-update](https://github.com/prisma/ecosystem-tests/workflows/check-for-update/badge.svg)](https://github.com/prisma/ecosystem-tests/actions?query=workflow%3Acheck-for-update)                 | -             |


You can check out the latest test runs by checking the ["test" workflow results](https://github.com/prisma/ecosystem-tests/actions?query=workflow%3Atest).

## How it works

### Projects and Tests

The tests are defined in `.github/workflows/test.yaml` and `.github/workflows/optional-test.yaml`, and the test projects live in folder of form `foo/bar` in this repository. Each `foo` has one or multiple jobs in the GitHub Actions Workflows, and the `bar`s are part of the matrix per job.

- All of the jobs run `.github/scripts/test-project.sh`, which then executes the test project.
- The test project can install additional dependencies such as CLIs in the optional `prepare.sh`. 
- The standard entrypoint to set up your projects is `run.sh`. This includes installing dependencies, deploying etc.
- Test are then triggered via `test.sh`.
- Any clean up or logging work can then be done in `finally.sh` which is executed in all cases, even when the tests fail.

**Note:** You need to use `pnpm` as it's used for bumping dependencies; i.e. run `pnpm install` as a first step in your `run.sh` script.   
**Note:** It's important to add `prisma` as a `devDependency` and `@prisma/client` as a normal `dependency` in each project's `package.json`.

### Database 

Most tests use a database. The GitHub workflow creates and provides a `DATABASE_URL` to all jobs, and `.github/scripts/test-project.sh` runs `prisma db push` to make sure the project's schema exists on the database.

Projects that use an external database use a different environment variable name from `DATABASE_URL`.

On AWS we use the following 4 databases for these tests:
- `e2e-tests-postgres.cdoyhcosd7km.us-east-1.rds.amazonaws.com` (AWS ORM Ecosystem Tests  275927176912 us-east-1)
- `e2e-tests-sqlserver.cdoyhcosd7km.us-east-1.rds.amazonaws.com` (AWS ORM Ecosystem Tests  275927176912 us-east-1)
- `postgres-e2e-ts.cg7tbvsdqlrs.eu-central-1.rds.amazonaws.com` (AWS Management Account 243760423205 eu-central-1)
- `e2e-tests-sql-server.cg7tbvsdqlrs.eu-central-1.rds.amazonaws.com` (AWS Management Account 243760423205 eu-central-1)

### Updates

#### Dependency

Renovate is enabled for this repository for all dependencies except `prisma` and `@prisma/client`. Our own script handles upgrading prisma-related dependencies since Renovate is too slow for our use case.

#### Prisma

When there is a new version, [Prismo](https://github.com/prisma-bot) works tirelessly to commit and push a bump commit, triggering the tests. This is implemented in `.github/workflows/check-for-update.yaml` using a GitHub Action cron job. Since the cron job is limited to run each 5 minutes, we just run each cron job for exactly 5 minutes and check for updates each 10 seconds in each run. This check only runs in the default branch `dev`.

### Branches and npm channels

The default `dev` branch of this repository contains the test projects with the development version of Prisma CLI and Prisma Client (`@dev` on npm). These dependencies are kept up to date with a GitHub Action workflow, which updates them every time a new version of Prisma is released.

There are also the branches `latest`, `patch-dev` and `integration`, which mirror the code from `dev` (synced via a GitHub Action workflow), but they use the respective development channels of Prisma CLI and Prisma Client from npm instead (`@latest`, `@patch-dev` and `@integration`, also updated via a GitHub Action workflow). Thanks to the test coverage of all projects, this can point us to incompatibilities early.

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

### How to add or adapt test projects

1. First add a matrix run entry in `.github/workflows/test.yaml` under the category the project falls into. For example, if you're adding a new platform into the `platforms` folder, put a new line named after your project folder in `.github/workflows/test.yaml` under `jobs.platforms.strategy.matrix.platform`.
2. Create that folder
3. Create the required test project files into that folder

### Shell scripts

Please write POSIX-compliant scripts (not bash) and use the the following template for all of your sh files to make sure they exit on errors (`-e`) and undefined variables (`-u`):

```shell script
#!/bin/sh

set -eux

# ...
```

