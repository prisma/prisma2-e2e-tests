# Cockroach Cloud

## How to run this locally

The environment variable `DATABASE_URL_COACKROACH_CLOUD` should point to a Cockroach Cloud database. 

To construct a suitable connection string, open the cluster in the CockroachCloud, click the `Connect` button on the rop right to open the `Connection info` modal. There go to the `Connection parameters` tab and construct a connection string with these values. You can ignore SSL and certificates completely.

### Run tests

```shell script
yarn && yarn prisma generate
sh test.sh
```
