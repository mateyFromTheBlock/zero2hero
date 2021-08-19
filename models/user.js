const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  logins: {
    type: [Date]
  }
});

module.exports = mongoose.model('User', userSchema);
