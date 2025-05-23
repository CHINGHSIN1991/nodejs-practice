const Tour = require('../models/tourModel')

// TODO: check if this function is needed
// Since the baseurl/api/v1/tours?duration[gte]=5&difficulty=easy in other place would be parsed correctly without this function
const parseQueryOperators = (queryObj) => {
  const parsedQuery = {}

  for (const [key, value] of Object.entries(queryObj)) {
    const match = key.match(/^(\w+)\[(\w+)\]$/)

    if (match) {
      const [, field, operator] = match

      if (!parsedQuery[field]) {
        parsedQuery[field] = {}
      }

      parsedQuery[field][operator] = value
    } else {
      parsedQuery[key] = value
    }
  }

  return parsedQuery
}

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1) Filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    console.log('Original query object:', queryObj)

    // 2) parse query operators
    const parsedQueryObj = parseQueryOperators(queryObj)

    // 3) set advanced filtering
    let queryStr = JSON.stringify(parsedQueryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    // 4) sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // EXECUTE QUERY
    const tours = await query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    })
  } catch (err) {
    console.error('Error in getAllTours:', err)
    res.status(404).json({
      status: 'fail',
      message: err.message || err,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: { tour },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    // const newTour = await Tour.create(req.body)
    // newTour.save()
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data: { tour },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}
