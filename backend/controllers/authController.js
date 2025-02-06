const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto')
const cloudinary = require('cloudinary')
const sendEmail = require('../utils/sendEmail')


//Register a user    => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return next(new ErrorHandler('Please provide all required fields.', 400));
        }
        const user = await User.create({
            username,
            email,
            password,
            role
        });

        // Calling jwt token
        sendToken(user, 201, res);
    } catch (error) {
        next(error)
    }
});

// Login User    => /api/v1/login
exports.loginUser = async (req, res, next) => {
    const {username, password} = req.body;

    // checks if username and password is entered by the user
    if(!username || !password) {
        return next(new ErrorHandler('Please enter username and password', 400))
    }

    //Finding user in database     +select, in this case user cannot select the password
    const user = await User.findOne({username}).select('+password')

    if(!user) {
        return next(new ErrorHandler('Username does not exist', 401));
    }

    //check password is correct or not 
    const isCorrectPassword = await user.comparePassword(password);

    if(!isCorrectPassword) {
        return next(new ErrorHandler(' Incorrect username or password', 401));
    }
    sendToken(user, 200, res);
}

// Forgot password   => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('No account found with this email', 404));
    }

    // Getting a reset token
    const resetToken = user.getResetPasswordToken();

    // Save the token to the database
    await user.save({validateBeforeSave:false});

    //create rest password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your pasword reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    // Sending Email for reset password token
    try {
        await sendEmail({
            email: user.email,
            subject: `Tinkteq Password Recovery`,
            message
        })
        res.status(200).json({
            success: true,
            message: `Reset password email sent to: ${user.email} sucessfully. Check your email for further instructions`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500));
    }
})


//Reset password       => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) =>{
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: {$gt: Date.now()}
    });

    if(!user) {
        return next(new ErrorHandler('Invalid or expired reset password token', 400));
    }

    // checking password match
    if(req.body.password !== req.body.comfirmPassword) {
        return next(new ErrorHandler('password does not match', 400));
    }
     // setup new password
    user.password = req.body.password;

    // setting this filed to undefined after setting up new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user. save();
    sendToken(user, 200, res)
})


//Get currently logged in user details    => /api/v1/me
 exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        success: true,
        user
    })
})

//Updata // Change password    => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // check if old password is correct
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    // Check if new password is closely related to the old one
    const isSimilar = await user.comparePassword(req.body.newPassword);
    if (isSimilar) {
        return next(new ErrorHandler('New password should not be closely related to the old one', 400));
    }
    
    // Set the new password and save
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res)
})




// Update user profile => /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const { firstname, lastname, username, email, avatar } = req.body;
    const { id } = req.user;

    const newUserData = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
    };

    // Update avatar
    if (avatar && avatar !== '') {
        const user = await User.findById(id);
        const image_id = user.avatar.public_id;
        
        // Delete the old avatar
        if (image_id) {
            await cloudinary.v2.uploader.destroy(image_id);
        }

        // Upload new avatar
        const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    const updatedUser = await User.findByIdAndUpdate(id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user: updatedUser,
    });
});

//Logout use    => /api/v1/logout
exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})


// Get all users    => /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})


// Admin Update user profile    => /api/v1/admin/user/:id
exports.adminUpdateUserProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        role: req.body.role
    }

      // Find the user by ID and update their profile
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })

     // Check if the user was found and updated
     if (!user) {
        return next(new ErrorHandler('User  not found', 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})


// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    
    // Delete avatar from cloudinary:  
    const image_id = user.avatar?.public_id;
        
        // Delete the old avatar
        if (image_id) {
            await cloudinary.v2.uploader.destroy(image_id);
        }

    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
})