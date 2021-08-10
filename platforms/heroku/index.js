const express = require('express')

const { PrismaClient, Prisma } = require('@prisma/client')
const client = new PrismaClient()

const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
  const fs = require('fs')
  const path = require('path')
  const files = fs.readdirSync(path.dirname(require.resolve('.prisma/client')))

  await client.user.deleteMany({})

  const id = '12345'

  const createUser = await client.user.create({
    data: {
      id,
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })

  const updateUser = await client.user.update({
    where: {
      id,
    },
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
  })

  const users = await client.user.findUnique({
    where: {
      id,
    },
  })

  const deleteManyUsers = await client.user.deleteMany()
  return res.send(
    JSON.stringify({
      version: Prisma.prismaVersion.client,
      createUser,
      updateUser,
      users,
      deleteManyUsers,
      files: files,
    }),
  )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
