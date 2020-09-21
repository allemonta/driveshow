const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    try {
        const jwtToken = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, jwtToken })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.send({ error: 'Not authenticated', isAuthenticated: false })
    }

}

module.exports = auth