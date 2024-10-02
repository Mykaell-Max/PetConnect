const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({

    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },

    adopter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },

    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },

    messages: {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now 
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;