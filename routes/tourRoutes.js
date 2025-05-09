const express = require('express')
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('./../controllers/tourController')
const router = express.Router()

router.param('id', checkID)

router.route('/').get(getAllTours).post(checkBody, createTour)
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour)

module.exports = router
