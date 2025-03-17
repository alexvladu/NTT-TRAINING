const fs=require('fs');
const Tour=require('../models/tourModel');
const APIFeatures=require('../utils/apiFeatures');
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


exports.getAllTours = async (req, res) => {
    try{

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
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getTour= async (req, res) => {
    try{
        const tour=await Tour.findById(req.params.id);
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        });
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};
exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:'success',
            tour: newTour
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updatedTour = async (req, res) => {
    try{
        const tour=await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status:'success',
            tour
        });
    }
    catch{
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteTour = async (req, res) =>{
    try{
        const tour=await Tour.findByIdAndDelete(req.params.id,);
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        });
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getTourStats = async (req, res) => {
    try{
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
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}
exports.getMonthlyPlan = async (req, res)=>{
    try{
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
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}