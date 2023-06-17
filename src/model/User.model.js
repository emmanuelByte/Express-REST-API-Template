const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String, //user and admin
    isVerified: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
