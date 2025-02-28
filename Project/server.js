const mongoose= require('mongoose');
const app= require('./app');
const dotenv= require('dotenv');


dotenv.config({path: './config.env'});

const DB=process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
console.log(DB);
mongoose.connect(DB)
.then(con=>{
    console.log('Connected to MongoDB');
});

const port=process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
