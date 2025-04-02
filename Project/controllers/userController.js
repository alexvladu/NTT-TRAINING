const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
    let newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) 
            newObj[el]=obj[el];
    });
    return newObj;
} 

exports.getAllUsers= catchAsync(async (req, res, next) => {

    const users = await User.find({});
    res.json({
        status:'success',
        results: users.length,
        data:{
            users
        }
    });
})

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

exports.getUser= (req, res) => {

}
exports.createUser= (req, res) => {

}
exports.updateUser= (req, res) => {

}
exports.deleteUser= (req, res) => {

}