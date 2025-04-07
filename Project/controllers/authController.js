const {promisify}=require('util');
const User=require('../models/userModel');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
const createSendToken = (user, statusCode, res) =>{
    const token = signToken(user._id);

    const cookieOptions={
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') cookieOptions.secure=true;

    res.cookie('jwt', token, cookieOptions);


    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    });
}

exports.signup= catchAsync(async(req, res, next) => {
    const newUser=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    createSendToken(newUser, 200, res);
});

exports.login=catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password)
        return next(new AppError('Please provide email and password', 400));

    //2 Check if user & password is correct
    const user = await User.findOne({email});
    if(!user || !(await user.checkPassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3 If everything is OK, send the token.
    createSendToken(user, 200, res);
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

exports.forgotPassword=catchAsync(async(req, res, next) => {
    //1) Get user by email
    const user= await User.findOne({email:req.body.email});
    if(!user)
        return next(new AppError('No user found with that email', 404));

    //2) Create new password reset token for current user
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    //3) Send reset token to the user email
    const resetURL=`${req.protocol}://${req.hostname}/api/v1/users/resetPassword/${resetToken}`;
    try{
        await sendEmail({
            to: user.email,
            subject: 'Password reset token (valid for 10 minutes)',
            message: `Reset your password by clicking this link: ${resetURL}`
        });

        res.status(200).json({
            status: 'success',
            message: 'Reset password email sent'
        });
    } catch(error){
        user.passwordResetToken=undefined;
        user.passwordResetExpiresAt=undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError("There was an error sending reset Password Token, try again later", 500));
    }
});

exports.resetPassword=catchAsync(async(req, res, next) => {
    //1) Get user by token, set the new password
    const resetToken = req.params.token;
    const encryptedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({passwordResetToken:encryptedToken});

    //2) Validate user and token valability
    if(!user || user.passwordResetExpiresAt < Date.now())
        return next(new AppError('Token expired or invalid', 400));

    //3) Set new password and update changedPasswordAt
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    //4) Log the user in
    createSendToken(user, 200, res);

});

exports.updatePassword = catchAsync(async (req, res, next) =>{

    //1 Get user from the collection
    const user=await User.findById(req.user.id);

    //2 If the prompted password is correct

    const promptedCurrentPassword=req.body.currentPassword;
    const promptedNewPassword=req.body.newPassword;
    const promptedNewPasswordConfirm=req.body.newPasswordConfirm;

    if(!user || !(await user.checkPassword(promptedCurrentPassword)))
        return next(new AppError('Incorrect password', 401));

    //3 Update the password

    user.password=promptedNewPassword;
    user.passwordConfirm=promptedNewPasswordConfirm;
    await user.save();

    //4) Log the user in
    createSendToken(user, 200, res);

});
