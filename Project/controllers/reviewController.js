const Review = require ('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory=require('./handlerFactory');

exports.setTourUserIds = (req, res, next)=>{
    if(!req.body.tour)
        req.body.tour=req.params.tourId;
    if(!req.body.user)
        req.body.user=req.user.id;
    next();
}
exports.getAllReviews=catchAsync(async (req, res, next)=>{
    let filter={};
    if(req.params.tourId) filter={tour:req.params.tourId};
    
    const reviews= await Review.find(filter);
    res.status(200).json({
        status:'success',
        result:reviews.length,
        data:{
            request_time:req.request_time,
            reviews
        }
    });
});

exports.createReview=factory.createOne(Review);
exports.getReview=factory.getOne(Review);
exports.getAllReviews=factory.getAll(Review);
exports.updateReview=factory.updateOne(Review);
exports.deleteReview=factory.deleteOne(Review);