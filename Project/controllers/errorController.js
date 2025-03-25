const AppError = require('../utils/appError');
const handleCastError = err=>{
    const message=`Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}
const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}
const sendErrorProd = (err, res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else{
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again later'
        })
    }
}
const handleJWTError = () => new AppError("Invalid token, please try again", 401);
const handleTokenExpiredError = () => new AppError("Token expired, please try again", 401);
//TO DO sec.120 121 122 123
module.exports=(err, req, res, next) => {
    err.statusCode = err.statusCode || 500;    
    err.status= err.status || 'error';

    if(process.env.NODE_ENV === 'development')
        sendErrorDev(err, res);
    else if(process.env.NODE_ENV === 'production')
    {
        let error = Object.create(
            Object.getPrototypeOf(err), // Obține prototipul original
            Object.getOwnPropertyDescriptors(err) // Copiază toate proprietățile, inclusiv cele non-enumerabile
          );
        if(error.name==='CastError')
            error=handleCastError(error);
        if(error.name==='JsonWebTokenError') error=handleJWTError();
        if(error.name==='TokenExpiredError') error=handleTokenExpiredError();
        sendErrorProd(error, res);
    }
}