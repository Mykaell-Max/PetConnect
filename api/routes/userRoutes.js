const express = require("express");
const multer = require("multer");
const router = express.Router();

const imageHandler = multer().single('profilePicture');

const userController = require("../controller/userController");

router
    .route('/register')
    .post(userController.createUser)

router
    .route('/login')
    .post(userController.loginUser)

router
    .route('/:userId')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router
    .route('/:userId/profilePic')
    .post(imageHandler, userController.uploadProfilePic)
    .patch(imageHandler, userController.uploadProfilePic)
    .delete(userController.deleteProfilePic)


module.exports = router;