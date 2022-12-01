const path = require('path')

module.exports = (envName) => {
  const { NODE_ENV } = process.env
  if (NODE_ENV != 'production') {
  
    const envFile = envName === 'test' ? '../.env.test' : '../.env'
    
    require('dotenv').config({
      path: path.join(__dirname, envFile),
    })
  
    const databaseName = process.env.PGDATABASE
  
    delete process.env.PGDATABASE

    return databaseName
  }
}