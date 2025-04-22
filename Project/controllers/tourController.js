const fs=require('fs');
const Tour=require('../models/tourModel');
const APIFeatures=require('../utils/apiFeatures');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');
const factory=require('./handlerFactory');

exports.aliasTopTours = (req, res, next) =>{
    req.query.limit=5;
    req.query.sort='-avgRating,price';
    req.query.fields='name,price,description,summary'
    next();
}

exports.createTour = factory.createOne(Tour);
exports.getTour= factory.getOne(Tour, {path:'reviews'});
exports.getAllTours = factory.getAll(Tour);
exports.updatedTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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

exports.getToursWithin=catchAsync(async(req, res, next)=>{
    const {distance, latlng, unit}=req.params;
    const [lat, lng] = latlng.split(',');

    if(!lat || !lng)
        next(new AppError("Please provide latitude and longitude in the format lat,lng"), 400);

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await Tour.find({ 
        startLocation: {
            $geoWithin:{
                $centerSphere: [[lng*1, lat*1], radius]
            }
        }
    });
    res.status(200).json({
        status:'success',
        tours
    });
});

exports.getDistances = catchAsync(async(req, res, next)=>{
    const {latlng, unit}=req.params;
    const [lat, lng] = latlng.split(',');

    if(!lat || !lng)
        next(new AppError("Please provide latitude and longitude in the format lat,lng"), 400);

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    const distances=await Tour.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates: [lng*1, lat*1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project:{
                distance:1,
                name:1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data:{
            distances
        }
    })
});