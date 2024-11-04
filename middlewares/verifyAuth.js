const jwt = require('jsonwebtoken');
const Pet = require('../mongo/petModel');
const Chat = require('../mongo/chatModel');


async function userAuth(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const tokenUserId = jwt.verify(token, global.env.JWTKEY).userId;

        const reqUserId = req.params.userId;

        if (tokenUserId === reqUserId) {
            next();
        } else {
            return res.status(403).json({message: "You don't have permission!"});
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};


async function petOwnerShip(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const tokenUserId = jwt.verify(token, global.env.JWTKEY).userId;

        const petId = req.params.petId;
        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({message: 'Pet not found!'});
        }

        if (pet.donor.toString() !== tokenUserId) {
            return res.status(403).json({message: "You don't have permission!"});
        }

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }
};


async function petAdoptionAuth(req, res, next) {
    try {
        const petId = req.params.petId;
        const adopterId= req.body.adopterId;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        const token = req.headers.authorization.split(' ')[1];
        const tokenUserId = jwt.verify(token, global.env.JWTKEY).userId;
        
        if (tokenUserId !== adopterId) {
            return res.status(403).json({message: "You don't have permission!"});
        }

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

async function petRemoveAdoptionAuth(req, res, next) {
    try {
        const petId = req.params.petId;
        const adopterId = req.query.adopterId;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        const token = req.headers.authorization.split(' ')[1];
        const tokenUserId = jwt.verify(token, global.env.JWTKEY).userId;
        
        if (tokenUserId !== adopterId) {
            return res.status(403).json({message: "You don't have permission!"});
        }

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }
};


async function chatAuth(req, res, next) {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found!' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const tokenUserId = jwt.verify(token, global.env.JWTKEY).userId;

        if(tokenUserId !== chat.donor.toString() && tokenUserId !== chat.adopter.toString()){
            return res.status(403).json({message: "You don't have permission!"});
        }

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }   
};


async function createChatAuth(req, res, next){
    try {
        const donor = req.body.donor;
        const adopter = req.body.adopter;
        const token = req.headers.authorization.split(' ')[1];
        const tokenUserId = jwt.verify(token, global.env.JWTKEY).userId;

        if(tokenUserId !== donor && tokenUserId !== adopter){
            return res.status(403).json({message: "You don't have permission!"});
        }

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }
};


module.exports = {userAuth, petOwnerShip, petAdoptionAuth, chatAuth, createChatAuth, petRemoveAdoptionAuth};
