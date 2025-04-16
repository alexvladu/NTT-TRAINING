const mongoose= require('mongoose');
const dotenv= require('dotenv');
const fs= require('fs');
const Tour=require('../../models/tourModel');
const User=require('../../models/userModel');
const Review=require('../../models/reviewModel');

const tourData=JSON.parse(fs.readFileSync('./tours.json', "utf8"));
const reviewData=JSON.parse(fs.readFileSync('./reviews.json', "utf8"));
const userData=JSON.parse(fs.readFileSync('./users.json', "utf8"));


dotenv.config({path: '../../config.env'});
const DB=process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(con=>deleteData()).then(rez=>insertData());

const insertData=async ()=>{
    try{
        await Tour.create(tourData);
        await User.create(userData, {validateBeforeSave: false});
        await Review.create(reviewData);
        console.log('Data Imported Successfully');
    }
    catch(err){
        console.error('Error importing data', err);
    }
}


const deleteData=async()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Deleted Successfully');
    }
    catch(err){
        console.error('Error deleting data', err);
    }
}