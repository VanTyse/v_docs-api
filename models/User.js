const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, 'Please provide a valid email'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
        minlength : 6,
        unique : true
    },

    password : {
        type : String,
        required : [true, 'Please Provide a password'],
    },
})

UserSchema.pre('save', async function(){
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(this.password, salt);
    this.password = hashedPassword
})

UserSchema.methods.createJWT = function(){
    const payload = {
        name : this.name,
        userID : this._id
    }
    return jwt.sign(payload, process.env.JWT_SECRET)
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema);