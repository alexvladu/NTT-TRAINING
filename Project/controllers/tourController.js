const fs=require('fs');
const Tour=require('../models/tourModel');
const APIFeatures=require('../utils/apiFeatures');
const catchAsync=require('../utils/catchAsync');
const { json } = require('stream/consumers');

exports.checkBody= (req, res, next) =>{
    if(!req.body.name || !req.body.price)
        return res.status(400).json({status: 'fail', message: 'Missing name or price in request body'});
    next();
}

exports.aliasTopTours = (req, res, next) =>{
    req.query.limit=5;
    req.query.sort='-avgRating,price';
    req.query.fields='name,price,description,summary'
    next();
}


exports.getAllTours = catchAsync(async (req, res, next) => {
    const features=new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const tours= await features.query;

    res.json({
        status:'success',
        result: tours.length,
        data: {
            request_time:req.request_time,
            tours
        }
    })
})

exports.getTour= catchAsync(async (req, res, next) => {
    const tour=await Tour.findById(req.params.id);
    if(!tour)
        return next(new AppError('No tour found with that ID', 404));

    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    });
})


exports.createTour = catchAsync(async(req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status:'success',
        tour: newTour
    });
});

exports.updatedTour = catchAsync(async (req, res, next) => {
    const tour=await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status:'success',
        tour
    });
});

exports.deleteTour = catchAsync(async (req, res, next) =>{
    const tour=await Tour.findByIdAndDelete(req.params.id,);
    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats=await Tour.aggregate([
        {
            $match: {ratingsAverage: {$gte: 4.5}}
        },
        {
            $group: {
                _id: "difficult",
                numRatings: {$sum: '$ratingsQuantity'},
                numTours: {$sum: 1},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}
            }
        }
    ]);
    res.json({
        status:'success',
        data: stats
    });
})

exports.getMonthlyPlan = catchAsync(async (req, res, next)=>{
    const year=req.params.year*1;
    const plan=await Tour.aggregate([
    {
        $unwind: '$startDates'
    },
    {
        $match: {
            startDates: {$gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31)},
            //ratingsQuantity: {$gte: 10}
        }
    },
    {
        $group: {
            _id: {$month: '$startDates' },
            numTours: {$sum: 1},
            tours: {$push: '$name'}
        }
    },
    {
        $addFields: {month: '$_id'}
    },
    {
        $project: {
            _id: 0
        }
    }

    ]);
    res.json({
        status:'success',
        data: {
            dataLength: plan.length,
            plan
        }
    });
})