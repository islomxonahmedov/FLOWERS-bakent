const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Boolean,
            default: false,
        },
        verified: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['Active', 'Idle'],
            default: 'Idle'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('auth', authSchema);
