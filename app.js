const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// Global Middlewares

// Set security HTTP Headers
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())

// Prevent parameter pollution

// Serving static files
app.use(express.static(`${__dirname}/public`))

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// Mounting the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// 404 Not Found
app.all('/*splat', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
