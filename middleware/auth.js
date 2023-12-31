const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/user')

exports.protect = asyncHandler(async (req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }

    else if(req.cookies.token){
        token = req.cookies.token
    }

    //Checking if token exists
    if(!token){
        return next(new ErrorResponse('Not Authorize to access this token', 401))
    }

    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)
        
        next();

    } catch (err) {
        return next(new ErrorResponse('Not Authorize to access this token', 401))
    }
})

exports.authorize = (...role) => {
    return (req,res,next) => {
        if(!role.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
        }
        next();
    }
}