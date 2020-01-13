const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const { Photon } = require('./prisma/photonjs')

const photon = new Photon()

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  const createUser = await photon.users.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })

  const updateUser = await photon.users.update({
    where: {
      id: createUser.id,
    },
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
  })

  const users = await photon.users.findOne({
    where: {
      id: createUser.id,
    },
  })

  const deleteManyUsers = await photon.users.deleteMany()

  return res.send(
    JSON.stringify({
      createUser,
      updateUser,
      users,
      deleteManyUsers,
    }),
  )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
