const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, min: 4, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
