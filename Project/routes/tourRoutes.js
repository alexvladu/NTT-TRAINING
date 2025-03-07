const express=require('express');
const tourController=require('../controllers/tourController');


const router=express.Router();

router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updatedTour).delete(tourController.deleteTour);

module.exports=router;