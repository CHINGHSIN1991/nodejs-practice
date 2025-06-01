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

class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }
  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    // advanced filtering
    const parsedQueryObj = parseQueryOperators(queryObj)
    let queryStr = JSON.stringify(parsedQueryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }
  paginate() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

module.exports = APIFeatures
