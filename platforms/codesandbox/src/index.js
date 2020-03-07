const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const { PrismaClient } = require('@prisma/client')
const client = new PrismaClient()
const app = express()

app.get('/', async (req, res) => {
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

  const users = await client.user.findOne({
    where: {
      id,
    },
  })

  const deleteManyUsers = await client.user.deleteMany()

  return res.send(
    JSON.stringify({
      createUser,
      updateUser,
      users,
      deleteManyUsers,
    }),
  )
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}!`))
