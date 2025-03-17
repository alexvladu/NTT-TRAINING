const express=require('express');
const tourController=require('../controllers/tourController');


const router=express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/stats').get(tourController.getTourStats);
router.route('/get-monthly/:year').get(tourController.getMonthlyPlan);

router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updatedTour).delete(tourController.deleteTour);

module.exports=router;