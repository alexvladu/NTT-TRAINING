const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const Review = require('./reviewModel');
const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Tour name is required'],
        maxLength:[50, "The tour name can't exceed 50 characters"],
        minLength:[5, "The tour name need to be at least 5 characters"],
        unique:true
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
        maximum:[5, "Rating should be less than 5"],
        set: val => Math.round(val*10) / 10
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
    },
    startLocation:{
        type:{
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations:[
        {
            type:{
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
    
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
});

tourSchema.index({price:1, ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation: '2dsphere'})
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

tourSchema.virtual('reviews', {
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
});

tourSchema.pre('save', function(next){
    this.slugName=slugify(this.name, {lower:true, strict:true});
    next();
})
/*
EMBEDDING 
tourSchema.pre('save', function(next){
    const guidesPromises = this.guides.map(async id=>await User.findById(id));
    this.guides=Promise.all(guidesPromises);
    next();
})
*/
tourSchema.pre(/^find/, function(next){
    this.populate({
        path: 'guides',
        select:'-__v -passwordChangedAt'
    });
    next();
})

tourSchema.pre(/^find/, function(next){
    this.find({secretTour:{$ne: true}}); 
    this.start=Date.now();  
    next();
})
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took: ${Date.now()-this.start} miliseconds`);
    next();
})

const Tour=mongoose.model('Tour', tourSchema);
module.exports=Tour;