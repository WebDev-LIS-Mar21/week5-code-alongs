const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: String,
  description: String,
  //author: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author' //Relates to the Author model
  },
  reviews: [
    {
      user: String,
      comment: String
    }
  ],
  rating: Number,
  imageUrl: String
  //isDeleted: Boolean
}, {
  timestamps: true
});

module.exports = model('Book', bookSchema);