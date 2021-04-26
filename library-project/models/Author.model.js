const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema({
  name: String,
  bio: String,
  pictureUrl: String
});

module.exports = model('Author', authorSchema);