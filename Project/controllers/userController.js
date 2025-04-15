const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory=require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    let newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) 
            newObj[el]=obj[el];
    });
    return newObj;
} 

exports.getMe = (req, res, next) =>{
    req.params.id=req.user.id;
    next();
}

exports.updateMe=catchAsync(async (req, res, next) =>{
    //1) check if user POSTs password data
    if(req.body.password || req.body.passwordConfirm)
        return next(AppError("Please use /updateMyPassword to update password."), 400);

    //2) update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser=await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:'succes',
        data:{
            user:updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next)=>{
    const user=await User.findByIdAndUpdate(req.user.id, {active:false});
    res.status(204).json({
        status:'succes',
        data:null
    })
})

exports.createUser=(req, res)=>{
    res.status(500).json({
        status:'error',
        message: 'This route is undefined. Please use /signup route'
    });
}
exports.getUser=factory.getOne(User);
exports.getAllUsers=factory.getAll(User);
exports.updateUser=factory.updateOne(User);
exports.deleteUser=factory.deleteOne(User);