# PlanetScale

PlanetScale Database

## How to run this locally

### Environment Variables

Set the env var `DATABASE_URL_PLANETSCALE`

> [!NOTE]
> Note that all planetscale tests share the same database but operate on different tables.
> They use the database "e2e-tests" in the prisma org.
> The `orm-infra@prisma.io` has full access to this. => See 1Password.
