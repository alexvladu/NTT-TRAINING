const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter= require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const hpp = require('hpp');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

//SERVING STATIC FILES.
app.use(express.static("./public"));


const port=3000;

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

const limiter=rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in 1 hour!"
});

//SET LIMITER REQUESTS from same IP
app.use('/api', limiter);



//BODY PARSER reading data from body to req.body
app.use(express.json({limit: '10kb'}));


//Data sanitization against NoSQL query injection
app.use(mongoSanitize());


//Data sanitization against XSS
app.use(xss());

//Prevent parameter polution
app.use(hpp({
    whitelist:[
        'duration', 
        'ratingsQuantity', 
        'ratingsAverage', 
        'duration', 
        'maxGroupSize', 
        'difficulty', 
        'price'
    ]
}));

app.use(cors({
    origin: "http://127.0.0.1:3000",
}));

app.use(cookieParser());

  
  


app.use((req, res, next) => {
    console.log(`Request type: ${req.method}, URL: ${req.url}`);
    next();
});
app.use((req, res, next) => {
    req.request_time=new Date().toISOString();
    next();
})


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}` + ' on server', 404));
});

app.use(globalErrorHandler);

module.exports = app;
