const mongoose = require('mongoose');
const Tour = require('./tourModel.js');
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true, "Review can not be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, "Review must belong to a user!"]
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true, "Review must belong to a tour!"]
    }
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
});

reviewSchema.pre(/^find/, function(next){
    this.populate({
       path:'user',
       select:'name photo'
    });
    next();
})

reviewSchema.statics.calculateAverageRatins = async function(tourId){
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id: '$tour',
                nRatings: {$sum: 1},
                avgRatings: {$avg: '$rating' }
            }
        }
    ]);
    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRatings
        });
    }
    else{
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
}

reviewSchema.index({tour:1, user:1}, {unique: true});

reviewSchema.post('save', function(){
    this.constructor.calculateAverageRatins(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.result = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function(){
    await this.result.constructor.calculateAverageRatins(this.result.tour);
});


const Review=mongoose.model('Review', reviewSchema);
module.exports=Review;