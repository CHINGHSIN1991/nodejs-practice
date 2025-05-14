const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB')
})

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  // priceDiscount: {
  //   type: Number,
  //   default: 0,
  // },
  // summary: {
  //   type: String,
  //   trim: true,
  //   required: [true, 'A tour must have a description'],
  // },
  // description: {
  //   type: String,
  //   trim: true,
  // },
  // imageCover: {
  //   type: String,
  //   required: [true, 'A tour must have a cover image'],
  // },
  // images: [String],
  // createdAt: {
  //   type: Date,
  //   default: Date.now(),
  // },
  // startDates: [Date],
})

const Tour = mongoose.model('Tour', tourSchema)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App is running on port ${port}...`)
})
