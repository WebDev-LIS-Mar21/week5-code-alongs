const bcrypt = require('bcryptjs');
const plainPassword = 'cat';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
console.log(`salt: ${salt}`);
const hashedPassword = bcrypt.hashSync(plainPassword, salt); 
//the hashed password is the password that the user wrote when registered on the web app
console.log(`hashed password: ${hashedPassword}`);
const passwordToCheck = 'cat'; //the password that the user writes on the login form
const isValid = bcrypt.compareSync(passwordToCheck, hashedPassword);
console.log(`Correct password: ${isValid}`);