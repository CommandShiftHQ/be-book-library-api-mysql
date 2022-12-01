const { Client } = require('pg')
const loadEnv = require('./load-env')

const envName = process.argv.slice(2)[0]

const dropDatabase = async (databaseName) => {
  const client = new Client()
  try {
    await client.connect()
  
    console.log(`Destroying ${databaseName} database...`)
  
    await client.query(`DROP DATABASE ${databaseName} WITH (FORCE)`)
  
    console.log('Database destroyed!')
  } catch (err) {
    console.log(err)

  } finally {
    client.end()
  }
}

const databaseName = loadEnv(envName)
dropDatabase(databaseName)