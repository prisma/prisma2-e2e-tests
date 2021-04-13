# Generic test TODO

This example runs a simple test script which locally runs CRUD actions against a remote postgres database.

## How to run this locally

This project is a special case, since it's run with different configurations in
CI, for example on different operating systems and using different node versions.

### Environment variables

The environment variable `OS_BASE_PG_URL` should point to a postgres database.
In CI, it uses our internal e2e test database using `os-base` as database URL.
Please check our internal 1Password E2E vault for a ready-to-use environment variable or  
set up your own database and set the environment variable accordingly.

### Run tests

```shell script
sh run.sh
```
