const jwt = require("jsonwebtoken")
require('dotenv').config()
const {UnauthenticatedError} = require('../errors');

const authMiddleWare =  (req, res, next) => {
    try {
        const {authorization} = req.headers
        if (!authorization.startsWith('Bearer')){
            throw new UnauthenticatedError('No token provided')
        }

        const token = authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const {name, userID}  = decodedToken
        req.user = {name, userID}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Not authorized to access this route')
    }
}

module.exports = authMiddleWare