const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Tour name is required'],
    },
    slugName:String,
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
        default:Date.now(),
        select:false
    },
    startDates:[Date]
    
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

tourSchema.pre('save', function(next){
    this.slugName=slugify(this.name, {lower:true, strict:true});
    next();
})

const Tour=mongoose.model('Tour', tourSchema);
module.exports=Tour;