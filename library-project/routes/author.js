const express = require('express');
const router = express.Router();
const Author = require('../models/Author.model');

router.get('/authors/create', (req, res) => {
  res.render('author-create');
});

router.post('/authors/create', async (req, res) => {
  const { name, bio, pictureUrl } = req.body;
  await Author.create({
    name,
    bio,
    pictureUrl
  });
  res.redirect('/books')
});


module.exports = router;