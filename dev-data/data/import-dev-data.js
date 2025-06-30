const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB')
})

// Read the data from the file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`, 'utf-8')
)
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/users.json`, 'utf-8')
)
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/reviews.json`, 'utf-8')
)

// Import data into the database
const importData = async () => {
  try {
    // 1) Import tours
    console.log('Importing tours...')
    await Tour.create(tours)
    console.log('Tours successfully imported!')

    // 2) Import users
    console.log('Importing users...')
    await User.create(users, { validateBeforeSave: false })
    console.log('Users successfully imported!')

    // 3) Import reviews
    console.log('Importing reviews...')
    await Review.create(reviews)
    console.log('Reviews successfully imported!')

    console.log('All data successfully loaded!')
  } catch (err) {
    console.log('Error importing data:', err.message)
    if (err.errors) {
      Object.values(err.errors).forEach((error) => {
        console.log('Validation error:', error.message)
      })
    }
  }
  process.exit()
}

// Delete all data from the database
const deleteData = async () => {
  try {
    // Delete in reverse order of dependencies
    console.log('Deleting reviews...')
    await Review.deleteMany()
    console.log('Deleting users...')
    await User.deleteMany()
    console.log('Deleting tours...')
    await Tour.deleteMany()
    console.log('All data successfully deleted!')
  } catch (err) {
    console.log('Error deleting data:', err.message)
  }
  process.exit()
}

console.log(process.argv)

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
