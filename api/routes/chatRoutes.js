const express = require('express');
const router = express.Router();

const chatController = require('../controller/chatController');

const {verifyJWT} = require("../../middlewares/jwtAuth");

router.use(verifyJWT);

router
    .route('/createChat')
    .post(chatController.createChat);

router 
    .route('/:chatId')
    .post(chatController.addMessage)
    .get(chatController.getMessages)
    .delete(chatController.deleteChat);

router
    .route('/preview/:userId')
    .get(chatController.getUserChats);
    
module.exports = router;