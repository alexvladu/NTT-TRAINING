const mongoose = require('mongoose');
const validator= require('validator');
const bcrypt = require('bcryptjs');
const { validate } = require('./tourModel');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter a name"],
        minLength:5,
        maxLength:30
    },
    email:{
        type:String,
        required:[true, "Please enter a email address"],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail, 'Invalid email']
    },
    photo: String,
    password:{
        type:String,
        required:true,
        minLength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:true,
        validate:{
            validator: function(value){
                return value === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt:Date,
    role:{
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified()) return next();
    this.password=await bcrypt.hash(this.password, 12);
    this.passwordConfirm=undefined;
    next();

})

userSchema.methods.checkPassword= async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        //TO DO
    }
    return false;
}

const User=mongoose.model('User', userSchema);
module.exports = User;