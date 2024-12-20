const mongoose = require("mongoose")
const {isLocalValid} = require('../validators/addressValidator')

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    age: {
        type: String,
        trim: true,
        required: true
    },

    size: {
        type: String,
        trim: true,
        required: true,
        enum: ['Pequeno', 'Médio', 'Grande']
    },

    sex: {
        type: String,
        trim: true,
        required: true,
        enum: ['Macho', 'Fêmea']
    },

    neutered: {
        type: Boolean,
        required: true
    },

    about: {
        type: String,
        trim: true,
        required: false,
        maxlength: 500
    },

    healthIssues: {
        type: [String],
        trim: true,
        required: false
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

    pictures: {
        type: [String],
        required: true,
        validate: [
            {
                validator: function (array) {
                    return array.length >= 1;
                },
                message: 'At least one picture is required!'
            },
            {
                validator: function (array) {
                    return array.length <= 5;
                },
                message: 'A maximum of 5 pictures is allowed!'
            }
        ]
    },

    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    adoptionRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;