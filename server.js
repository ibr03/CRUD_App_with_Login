const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // path is already included in nodejs 
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./server/database/connection');

const app = express();

// Passport config
require('./config/passport')(passport);

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 8080;

// mongoDB connection
connectDB();

// Body-parser
app.use(express.urlencoded({ extended: true}));

// Express session 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Set view engine
app.set('view engine', 'ejs'); // app.set('views', path.resolve(__dirname, 'views/ejs')) (IF VIEW TEMPLATES STORED IN ANOTHER FOLDER (eg. here in 'views/ejs'))

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Load routes
app.use('/', require('./server/routes/router'));

app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) });