const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;   //500 means interna; server eror
    
    //Error handler for development mode
    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack,
        })
    }

    //error handler for production mode
    if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err}

        error.message = err.message;

        //wrong Mongoose Object ID Error handler
        if(error.name === 'CastError') {
            const message = `Resources not found. Invalid ${error.path}: ${error.value}`;
            error = new ErrorHandler(message, 400);
        }

        //Handling Mongoose validation errors
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            error = new ErrorHandler(messages.join(', '), 400);
        }

        // Handling mongoose duplicate key errors
        if(error.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyvalue)} entered`
            error = new ErrorHandler(message, 400);
        }

        // Handling wrong JWT errors
        if(err.name === 'JsonwebTokenError') {
            const message = 'JSON web token is invalid. Try again later!!!'
            error = new ErrorHandler(message, 400);
        }

        // Handling Expired JWT errors
        if(err.name === 'TokenExpiredError') {
            const message = 'JSON web token is expired. Try again later!!!'
            error = new ErrorHandler(message, 400);
        }

        
        res.status(err.statusCode).json({
            success: false,
            message: error.message  || 'Internal Server Error'
        });

    }
}