const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    resetPassword,
    getUserProfile,
    updatePassword,
    updateUserProfile,
    getAllUsers,
    getUserDetails,
    adminUpdateUserProfile,
    deleteUser
 } = require('../controllers/authController');
 const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");
const router = express.Router();


// Register user routes
router.route('/register',).post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/logout').get(logout);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('Admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('Admin'), getUserDetails)
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles('Admin'), adminUpdateUserProfile)
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles('Admin'), deleteUser)


module.exports = router;