const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();

//Middlewares

//Used for http requests logs
app.use(morgan('dev'));

//Used for parsing application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

//Used for parsing application/json
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    user.findById(id, function (err, user) {
        done(err, user);
    });
});

//Connect to MongoDB
const url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/campaigns';
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, response) => {
    if (err) throw err;
    else console.log('Connected to Mongo DB');
});

//cors options
const corsOptions = {
    origin: 'http://localhost:4200',
    optionSuccessStatus: 200
}

//Routes
app.use('/', cors(corsOptions), require('./routes/user'));

//Start the Server
const port = 8080 || process.env.port;
app.listen(port, () => console.log(`Listening to port ${port}`))