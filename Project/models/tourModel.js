const mongoose = require('mongoose');
const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Tour name is required'],
    },
    duration:{
        type:Number,
        required:[true, 'Tour duration is required'],
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'Tour max group size is required'],
        min:1,
        max:50
    },
    difficulty:{
        type:String,
        required:[true, 'Tour difficulty is required'],
        enum:['easy', 'medium', 'difficult']
    },
    ratingsAverage:{
        type:Number,
        default:0
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'Tour price is required'],
        min:0
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true, 'Tour summary is required'],
        maxLength:150
    },
    description:{
        type:String,
        trim:true,
    },
    imageCover:{
        type:String,
        required:[true, 'Tour image cover is required'],
    },
    imges:[String],
    createdAt:{
        type:Date,
        default:Date.now
    },
    startDates:[Date]
    
});
const Tour=mongoose.model('Tour', tourSchema);
module.exports=Tour;