const express = require("express");
const multer = require("multer");
const router = express.Router();

const imageHandler = multer().single('profilePicture');

const {
    createUser, 
    loginUser,
    getUser, 
    updateUser, 
    deleteUser,
    uploadProfilePic
} = require("../controller/userController");

router.post('/register', createUser);
router.post('/login', loginUser)

router.get('/:userId', getUser);
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUser);

router.post('/:userId/profilePic', imageHandler, uploadProfilePic);
// router.patch('/:userId/profilePic', ); 
// router.delete('/:userId/profilePic', );

module.exports = router;

