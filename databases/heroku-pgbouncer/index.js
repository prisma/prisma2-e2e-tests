const { PrismaClient } = require('@prisma/client')

const client = new PrismaClient({
  errorFormat: 'colorless',
  datasources: {
    db: {
      url: process.env.DATABASE_HEROKU_PGBOUNCER_URL,
    },
  },
})

const clientWithQueryStringParam = new PrismaClient({
  errorFormat: 'colorless',
  datasources: {
    db: {
      url: process.env.DATABASE_HEROKU_PGBOUNCER_URL + '?pgbouncer=true',
    },
  },
})

async function clientWithoutQueryStringParamCall() {
  const data = await client.user.findMany()
  return data
}

async function clientWithQueryStringParamCall() {
  const data = await clientWithQueryStringParam.user.findMany()
  return data
}

async function main() {
  try {
    const data1 = await client.user.findMany()
    console.log({ data1 })

    /*
     * Query engine instance names prepared statements serially s0, s1 and so on. Without the `pgbouncer=true` flag,
     * prepared statements are not cleaned up in PgBouncer. By doing disconnect/reconnect, we get a
     * new instance of query engine that starts again at s0. And we expect the next client call to throw
     * "prepared statement s0 already exists"
     */
    await client.$disconnect()
    await client.$connect()

    const data2 = await client.user.findMany()
    console.log({ data2 })
  } catch (e) {
    console.log(e)
  }

  const data3 = await clientWithQueryStringParam.user.findMany()
  console.log({ data3 })
  const data4 = await clientWithQueryStringParam.user.findMany()
  console.log({ data4 })
}

if (require.main === module) {
  main()
    .then((_) => {})
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      client.$disconnect()
      clientWithQueryStringParam.$disconnect()
    })
}

module.exports = {
  clientWithoutQueryStringParamCall,
  clientWithQueryStringParamCall,
  client,
  clientWithQueryStringParam,
}
