const { Client } = require('pg')
const loadEnv = require('./load-env')
const { duplicateDatabase } = require('../src/utils/postgres-errors')

const envName = process.argv.slice(2)[0]

const createDatabase = async (databaseName) => {
  const client = new Client()
  try {
    await client.connect()
  
    console.log(`Creating ${databaseName} database...`)
  
    await client.query(`CREATE DATABASE ${databaseName}`)
  
    console.log('Database created!')
  } catch (err) {

    switch (err.code) {
    case duplicateDatabase:
      console.log('Database already exists!')
      break
    default:
      console.log(err)
    }
  } finally {
    client.end()
  }
}

const databaseName = loadEnv(envName)
createDatabase(databaseName)