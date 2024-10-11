const express = require("express");
const multer = require("multer");
const router = express.Router();

const imageHandler = multer({limits: { fileSize: 1024 * 1024 * 2 }}).single('profilePicture');

const userController = require("../controller/userController");

const {verifyJWT} = require("../../middlewares/jwtAuth");
const {userAuth} = require("../../middlewares/verifyAuth")

router
    .route('/register')
    .post(userController.createUser);

router
    .route('/login')
    .post(userController.loginUser);


router.use(verifyJWT);


router
    .route('/:userId')
    .get(userController.getUser)
    .patch(userAuth, userController.updateUser)
    .delete(userAuth, userController.deleteUser);

router
    .route('/:userId/profilePic')
    .post(userAuth, imageHandler, userController.uploadProfilePic)
    .patch(userAuth, imageHandler, userController.uploadProfilePic)
    .delete(userAuth, userController.deleteProfilePic);

module.exports = router;