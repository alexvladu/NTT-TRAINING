const mongoose = require('mongoose');
const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Tour name is required'],
    },
    rating:{
        type:Number,
        required:[true, 'Tour rating is required'],
        min:1,
        max:5
    },
    price:{
        type:Number,
        required:[true, 'Tour price is required'],
        min:0
    }
});
const Tour=mongoose.model('Tour', tourSchema);
module.exports=Tour;