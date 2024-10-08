const express = require("express");
const multer = require("multer");
const router = express.Router();

const imageHandler = multer().single('profilePicture');

const userController = require("../controller/userController");

const {verifyJWT} = require("../../middlewares/jwtAuth");

router
    .route('/register')
    .post(userController.createUser)

router
    .route('/login')
    .post(userController.loginUser)

router
    .route('/:userId')
    .get(verifyJWT, userController.getUser)
    .patch(verifyJWT, userController.updateUser)
    .delete(verifyJWT, userController.deleteUser)

router
    .route('/:userId/profilePic')
    .post(verifyJWT, imageHandler, userController.uploadProfilePic)
    .patch(verifyJWT, imageHandler, userController.uploadProfilePic)
    .delete(verifyJWT, userController.deleteProfilePic)


module.exports = router;