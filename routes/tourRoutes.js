const express = require('express')
const authController = require('./../controllers/authController')
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController')
const reviewRouter = require('./reviewRoutes')
const router = express.Router()

// router.param('id', checkID)

// Nested route for reviews
router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(authController.protect, getAllTours).post(createTour)
router
  .route('/:id')
  .get(getTour)
  .patch(authController.protect, updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  )

module.exports = router
