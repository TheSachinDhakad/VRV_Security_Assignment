const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures unique emails
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        default: '67442d84fd47a9ae89bd57e7' // Set the default role for a normal user
    }
});

module.exports = mongoose.model('User', userSchema);
