const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message)
  console.log('🔥 Uncaught Exception! Shutting down...')
  process.exit(1)
})

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB')
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message)
  console.log('💥 Unhandled Rejection! Shutting down...')
  server.close(() => {
    process.exit(1)
  })
})
