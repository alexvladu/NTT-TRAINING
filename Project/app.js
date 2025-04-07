const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet=require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter= require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
const port=3000;

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

const limiter=rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in 1 hour!";
});

//SET LIMITER REQUESTS from same IP
app.use('/api', limiter);

//SET SECURITY HTTP HEADERS
app.use(helmet());


//BODY PARSER reading data from body to req.body
app.use(express.json({limit: '10kb'}));

//SERVING STATIC FILES.
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

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}` + ' on server', 404));
});

app.use(globalErrorHandler);

module.exports = app;
