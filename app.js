const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require("express-handlebars");
const passport = require('passport');
const session = require('express-session');
dotenv.config({ path: './config.env'});
require('./config/passport')(passport)

connectDB()

const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
    
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3001

app.listen(PORT, console.log(`Server is running at ${process.env.NODE_ENV} mode on port ${PORT}`));