const {promisify}=require('util');
const User=require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup= catchAsync(async(req, res, next) => {
    const newUser=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    });
});

exports.login=catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password)
        return next(new AppError('Please provide email and password', 400));

    //2 Check if user & password is correct
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.checkPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3 If everything is OK, send the token.
    const token = signToken(user._id);
    res.json({
        status:'success',
        token
    });
});

exports.protect=catchAsync(async(req, res, next) => {
    //1 Check if token exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if(!token) return next(new AppError('You are not logged in. Please log in to access this route.', 401));

    //2 Check if token is valid
    const decoded=await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3 Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) 
        return next(new AppError('The user belonging to this token does no longer exist.', 401));

    //4 Check if user changed password after token was issued

    if(currentUser.changedPasswordAfter(decoded.iat))
        return next(new AppError('User recently changed their password. Please log in again.', 401));


    //Grant access to protected route
    req.user = currentUser;
    next();
    
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError('You do not have permission to perform this action.', 403));
        next();
    }
}