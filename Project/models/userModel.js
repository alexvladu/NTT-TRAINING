const crypto = require('crypto');
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
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    passwordResetToken:String,
    passwordResetExpiresAt:Date
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password, 12);
    this.passwordConfirm=undefined;
    next();
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt=Date.now()-1000;
    next();
})

userSchema.methods.checkPassword= async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // Convertim data în secunde
        return JWTTimestamp < changedTimestamp; // Dacă tokenul este mai vechi decât modificarea parolei, trebuie invalidat
    }
    return false; // Dacă parola nu a fost schimbată, tokenul rămâne valid
};


userSchema.methods.createPasswordResetToken = function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpiresAt=Date.now()+10*60*1000;
    console.log(resetToken + " " + this.passwordResetToken);
    return resetToken;
}

const User=mongoose.model('User', userSchema);
module.exports = User;