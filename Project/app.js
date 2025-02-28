const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter= require('./routes/userRoutes');

const app = express();
const port=3000;

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
app.use(express.json());
app.use(express.static("./public"));


app.use((req, res, next) => {
    console.log(`Request type: ${req.method}, URL: ${req.url}`);
    next();
});
app.use((req, res, next) => {
    req.request_time=new Date().toISOString();
    next();
})


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
