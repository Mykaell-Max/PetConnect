const express = require('express');
const router = express.Router();

const chatController = require('../controller/chatController');

const {verifyJWT} = require("../../middlewares/jwtAuth");
const {userAuth, chatAuth, createChatAuth} = require("../../middlewares/verifyAuth")

router.use(verifyJWT);

router
    .route('/createChat')
    .post(createChatAuth, chatController.createChat);

router 
    .route('/:chatId')
    .post(chatAuth, chatController.addMessage)
    .get(chatAuth, chatController.getMessages)
    .delete(chatAuth, chatController.deleteChat);

router
    .route('/preview/:userId')
    .get(userAuth, chatController.getUserChats);
    
module.exports = router;