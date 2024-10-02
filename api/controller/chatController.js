const Chat = require('../../mongo/chatModel');

async function createChat(req, res) {
    try {
        const newChat = new Chat(req.body);
        await newChat.save();
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

        const chats = await Chat.find({
            $or: [
                { donor: userId },
                { adopter: userId }
            ]
        }).populate('donor adopter pet', 'name').select('donor adopter pet messages')

        // preciso saber se isso aqui vai mesmo funcionar, acho importante nao retornar todo o historico só pra uma preview
        const chatsList = chats.map(chat => ({
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