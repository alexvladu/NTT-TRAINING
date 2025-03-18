const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Tour name is required'],
        maxLength:[50, "The tour name can't exceed 50 characters"],
        minLength:[5, "The tour name need to be at least 5 characters"],
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
        enum:{
            values:['easy', 'medium', 'difficult'],
            message:'Difficulty must be easy, medium or difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        minimum:[0, "Rating should be greater than 0"],
        maximum:[5, "Rating should be less than 5"]
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
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    }
    
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

tourSchema.pre(/^find/, function(next){
    this.find({secretTour:{$ne: true}}); 
    this.start=Date.now();  
    next();
})
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took: ${Date.now()-this.start} miliseconds`);
    this.find({secretTour:{$ne: true}});   
    next();
})
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne: true}}});
    next();
})

const Tour=mongoose.model('Tour', tourSchema);
module.exports=Tour;