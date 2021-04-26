require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const helpers      = require('handlebars-helpers');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
//MAking handlebars helpers available in our views
hbs.registerHelper(helpers());

mongoose
  .connect('mongodb://localhost/library-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: true,
      httpOnly: true,
      maxAge: 60000
    },
    rolling: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 //1day
    })
  })
)

// Fake middleware
// function myFakeMiddleware(req, res, next) {
//   console.log('Im on the fake middleware');
//   next();
// }

// app.use(myFakeMiddleware);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//Middleware
app.use(express.static(path.join(__dirname, 'public')));
//Middleware
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Book library';

const index = require('./routes/index');
//Middleware
app.use('/', index);

const book = require('./routes/book');
app.use('/', book);

const author = require('./routes/author');
app.use('/', author);

const auth = require('./routes/auth');
app.use('/', auth);

module.exports = app;