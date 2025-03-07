const fs=require('fs');
const Tour=require('../models/tourModel');
const { json } = require('stream/consumers');
exports.checkBody= (req, res, next) =>{
    if(!req.body.name || !req.body.price)
        return res.status(400).json({status: 'fail', message: 'Missing name or price in request body'});
    next();
}

exports.getAllTours = async (req, res) => {
    try{
    console.log(req.query);
    
    const queryObject={...req.query};
    const excludedFields=['page', 'sort', 'limit', 'order', 'fields'];
    excludedFields.forEach(field=>delete queryObject[field]);

    let queryString=JSON.stringify(queryObject);
    queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);

    const toursData=await Tour.find(JSON.parse(queryString));
        

    res.json({
        status:'success',
        result: toursData.length,
        data: {
            request_time:req.request_time,
            tours: toursData
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