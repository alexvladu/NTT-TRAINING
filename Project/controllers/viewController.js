const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
exports.getOverview = catchAsync(async (req, res, next) =>{

    //1)get tour data
    const tours = await Tour.find();
    //2)build template

    //3)render that template
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});
exports.getTour = catchAsync(async(req, res) =>{

    //1 get the data)
    const {slug} = req.params;
    const tour=await Tour.findOne({slugName:slug}).populate({
        path:'reviews',
        fields:'review rating user'
    });
    console.log(tour);
    res.status(200).render('tour', {
        title: 'The forest hiker',
        tour
    });
});