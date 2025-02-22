const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/User");


// Checks if user is authenticated  or not
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
   const {token }= req.cookies

    // console.log(token)

    if(!token) {
        return next( new ErrorHandler('Login first to acceess this resources', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    next()
})


// //Handling users roles
// exports.authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if(!roles.includes(req.user.role)) {
//             return next(
//                 new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403)
//             )
//         }
//         next()
//     }
// }


// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user?.role}) is not allowed to access this resource`, 403)
            );
        }
        next();
    };
};
