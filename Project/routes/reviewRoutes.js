const express=require('express');
const reviewControler=require('../controllers/reviewController');
const authController=require('../controllers/authController');
const router=express.Router({mergeParams:true});
router.route('/')
    .get(reviewControler.getAllReviews)
    .post(authController.protect, reviewControler.setTourUserIds, reviewControler.createReview);
router.route('/:id')
    .patch(reviewControler.updateReview)
    .delete(authController.protect, reviewControler.deleteReview);

module.exports=router;