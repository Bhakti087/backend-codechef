const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be blank'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password cannot be blank'],
    unique: true,
  },
  email: {
    type: String,

    unique: true,
  },
  phone: {
    type: String,

    unique: true,
  },
})
module.exports = mongoose.model('User', userSchema)
