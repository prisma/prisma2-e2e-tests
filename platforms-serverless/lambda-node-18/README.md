# AWS Lambda

AWS Lambda. Zips the file and uploads it using the `--zip-file` aws cli flag.

## Friction points

- some modules are currently removed from the zip

## How to run this locally

### Install AWS CLI

We use the AWS CLI v1.

Follow [the official docs](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html).

The AWS v1 CLI is already pre-installed in GitHub Actions.

### Authenticate

- `AWS_DEFAULT_REGION`: The AWS region name. In Prisma's case, this is `eu-central-1`.
- `AWS_ROLE`: The aws role, e.g. `arn:aws:iam::<id>:role/service-role/<role-id>`.
- `AWS_SECRET_ACCESS_KEY`: The AWS secret.
- `AWS_ACCESS_KEY_ID`: The AWS access key id.

Check 1Password for the values for our ecosystem-tests account.

### Prepare

To create a function on your own account, run `sh create.sh` first.
