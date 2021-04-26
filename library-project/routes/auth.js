const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');


router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.render('auth/login', 
    { errorMessage: 'Indicate username and password' })
    return;
  }

  const user = await User.findOne({ username: username });
  if (user === null) {
    res.render('auth/login', 
    { errorMessage: 'Invalid login' })
    return;
  }

  //The user and password match
  if (bcrypt.compareSync(password, user.password)) {
    //Sucessful login
    
    req.session.currentUser = user;
    res.redirect('/');
   // res.render('index', { user });

  } else {
    //Passwords don't match
    res.render('auth/login', 
    { errorMessage: 'Invalid login' })
    return;
  }
});


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  //Checking for username and password being filled out
    if (username === '' || password === '') {
      res.render('auth/signup', 
      { errorMessage: 'Indicate username and password' })
      return;
    }

  //Check for password strength - Regular Expression
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (passwordRegex.test(password) === false) {
    res.render('auth/signup',
      { errorMessage: 'Password is too weak' })
    return;
  }

  //Check if the user already exists
  let user = await User.findOne({ username: username });
  console.log('user', user);
  if (user !== null) {
    res.render('auth/signup',
      { errorMessage: 'username already exists' })
    return;
  }

  user = await User.findOne({ email: email });
  console.log('user', user);
  if (user !== null) {
    res.render('auth/signup',
      { errorMessage: 'email already exists' })
    return;
  }


  //Create the user in the database
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.redirect('/');
  } catch (e) {
    res.render('auth/signup',
      { errorMessage: 'Error occurred' })
    return;
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;