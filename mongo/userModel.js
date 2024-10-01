const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
        maxlength: [50, 'O nome tem que ter menos de 50 caracteres'],
        minlength: [10, 'O nome tem que ter mais de 10 caracteres'],
        trim: true
        },

    lastName: {
        type: String,
        required: false,
        trim: true
        },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
        },

    password: {
        type: String,
        required: true,
        },

    phone: {
        type: String,
        required: false,
        trim: true
        },

    description: {
        type: String,
        required: false,
        maxlength: [500, 'A descrição tem que ter menos de 500 caracteres'],
        trim: true
        },

    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      neighborhood: {
        type: String,
        required: true,
        trim: true
      },
    city: {
        type: String,
        required: true,
        trim: true
        }
    },

    socialMedias: {
        type: [String],
        required: false,
        },
    
    profilePicture: {
        type: String,
        required: false,
        },
    
    registeredPets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Pet',
        required: false,
    },

    adoptionRequestsSent: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Pet',
        required: false,
    },

    chats: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Chat',
        required: false,
    }
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;