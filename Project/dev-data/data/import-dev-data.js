const mongoose= require('mongoose');
const dotenv= require('dotenv');
const fs= require('fs');
const Tour=require('../../models/tourModel');

const tourData=JSON.parse(fs.readFileSync('./tours.json', "utf8"));
console.log(tourData);


dotenv.config({path: '../../config.env'});
const DB=process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(con=>deleteData()).then(rez=>insertData());

const insertData=async ()=>{
    try{
        await Tour.create(tourData);
        console.log('Data Imported Successfully');
    }
    catch(err){
        console.error('Error importing data', err);
    }
}


const deleteData=async()=>{
    try{
        await Tour.deleteMany();
        console.log('Data Deleted Successfully');
    }
    catch(err){
        console.error('Error deleting data', err);
    }
}