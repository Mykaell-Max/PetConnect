const express = require("express");
const router = express.Router();

const {
    createUser, 
    getUser, 
    updateUser, 
    deleteUser
} = require("../controller/userController");

router.post('/register', createUser);
router.get('/:userId', getUser);
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;