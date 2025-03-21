const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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

exports.getUser= (req, res) => {

}
exports.createUser= (req, res) => {

}
exports.updateUser= (req, res) => {

}
exports.deleteUser= (req, res) => {

}