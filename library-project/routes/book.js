const express = require('express');
const router = express.Router();
const Book = require('../models/Book.model');
const Author = require('../models/Author.model');
const fileUpload = require('../configs/cloudinary');

router.get('/books', async (req, res) => {
  //1. Get all the books from the database
  try {
    const booksFromDB = await Book.find();
    //const booksFromDB = await Book.find({isDelete: false});
    res.render('books-list', { booksFromDB });
  } catch(e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.get('/books/create', async (req, res) => {
  const allAuthors = await Author.find();
  res.render('book-create', { allAuthors });
});

router.post('/books/create', fileUpload.single('image'), async (req, res) => {
  //file path (url) on cloudinary
  const fileOnCloudinary = req.file.path; 

  const { title, author, description, rating } = req.body;
  await Book.create({ 
    title, 
    author, 
    description, 
    rating, 
    imageUrl: fileOnCloudinary});
  res.redirect('/books');
});

router.get('/books/:bookId', async (req, res) => {
  //2. Get the book from the database by id
  const book = await Book.findById(req.params.bookId).populate('author');
  res.render('book-details', { book });
});

router.get('/books/:bookId/edit', async (req, res) => {
  const bookId = req.params.bookId 
  const book = await Book.findById(bookId).populate('author');
  const allAuthors = await Author.find();
  res.render('book-edit', { book, allAuthors });
});

router.post('/books/:bookId/edit', async (req, res) => {
  const bookId = req.params.bookId 
  const { title, author, description, rating } = req.body;
  await Book.findByIdAndUpdate(bookId, {
    title,
    author,
    description,
    rating
  });
  res.redirect(`/books/${bookId}`);
});

router.post('/books/:bookId/delete', async (req, res) => {
  const bookId = req.params.bookId;
 
//  await Book.findByIdAndUpdate(bookId, {
//    isDelete: true
//  })
  await Book.findByIdAndDelete(bookId);
  res.redirect('/books')
});

router.post('/reviews/:bookId/add', async (req, res) => {
  const bookId = req.params.bookId;
  const { user, comment } = req.body;
  await Book.findByIdAndUpdate(bookId, {
    $push: { reviews: { user, comment}}
  });
  res.redirect(`/books/${bookId}`);
});

module.exports = router;