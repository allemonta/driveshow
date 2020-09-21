const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    profilePicture: String,
    jwtToken: String,
    googleToken: {
        access_token: String,
        expiry_date: Number,
        id_token: String,
        scope: String,
        token_type: String
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.jwtToken
    delete userObject.googleToken

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.jwtToken = token
    await user.save()

    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User