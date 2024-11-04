const mongoose = require('mongoose');
const {hashPassword} = require('../utils/hashPassword');
const {isLocalValid} = require('../validators/addressValidator')

const userSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
        maxlength: [12, 'O nome tem que ter menos de 50 caracteres'],
        minlength: [3, 'O nome tem que ter mais de 10 caracteres'],
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
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid e-mail!']
        },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: false,
        trim: true,
        match: [/\(\d{2}\) \d{5}-\d{4}/, 'Invalid phone number!']
    },

    description: {
        type: String,
        required: false,
        maxlength: [500, 'A descrição tem que ter menos de 500 caracteres'],
        trim: true
    },

    address: {
        city: {
            type: String,
            required: true,
            trim: true
        },
        neighborhood: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: async function () {
                    const isCityValid = await isLocalValid(this.address.neighborhood, this.address.city);
                    return isCityValid;
                },
                message: 'Invalid Neighborhood and/or City.'
            }
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
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});


userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await hashPassword(this.password);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

async function hashPasswordMiddleware(next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            update.password = await hashPassword(update.password);
            this.setUpdate(update);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
}
userSchema.pre('findOneAndUpdate', hashPasswordMiddleware);
userSchema.pre('updateOne', hashPasswordMiddleware);


const User = mongoose.model('User', userSchema);
module.exports = User;