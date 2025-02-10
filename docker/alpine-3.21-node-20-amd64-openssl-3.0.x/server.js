#!/usr/bin/env node

const express = require('express')
const app = express()
const port = 3000

const { PrismaClient } = require('@prisma/client')

const client = new PrismaClient()

app.get('/', async (req, res) => {
  const data = await client.user.findMany()
  res.send(JSON.stringify(data))
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
