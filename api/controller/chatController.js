const Chat = require('../../mongo/chatModel');
const User = require('../../mongo/userModel');

async function createChat(req, res) {
    try {
        const donor = await User.findById(req.body.donor);
        const adopter = await User.findById(req.body.adopter);
        
        if (!donor) {
            return res.status(404).send("Donor not found!");
        }

        if (!adopter) {
            return res.status(404).send("Adopter not found!");
        }
        
        const newChat = new Chat(req.body);
        await newChat.save();
        await User.findByIdAndUpdate(donor._id, { $addToSet: { chats: newChat._id } }, { new: true });
        await User.findByIdAndUpdate(adopter._id, { $addToSet: { chats: newChat._id } }, { new: true });
        return res.status(201).json(newChat);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function addMessage(req, res) {
    try {
        const chatId = req.params.chatId;
        const {sender, content} = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found!' });
        }

        chat.messages.push({
            sender,
            content
        });

        await chat.save();
        return res.status(200).json(chat); 
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function getMessages(req, res) {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found!' });
        }

        return res.status(200).json(chat.messages); 
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function getUserChats(req, res) {
    try {
        const userId = req.params.userId;
        const Userchats = await User.findById(userId).select('chats').populate('chats');
        const chatsList = Userchats.chats.map(chat => ({
            donor: chat.donor,
            adopter: chat.adopter,
            pet: chat.pet,
            lastMessage: chat.messages[chat.messages.length - 1]
        }));

        return res.status(200).json(chatsList);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function deleteChat(req, res) {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found!' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


module.exports = {
    createChat,
    addMessage,
    getMessages,
    getUserChats,
    deleteChat
};