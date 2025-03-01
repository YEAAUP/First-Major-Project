const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;

// connecting to mongoose 
const db=require('./config/mongoos');


// Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src:'./assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix:'/css'
}));


app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('assets'));

// Make the uploads path available to the browser
app.use('/uploads', express.static(__dirname+'/uploads'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'codeial',
    // Cahnge the secret key in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge:(1000*60*100)
    },
    store:MongoStore.create({
        mongoUrl: 'mongodb://localhost/user_list',
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err||'connect-mongo setup ok');
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(customMware.setFlash);

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        //console.log('Error : ', err);
        console.log(`Error in running the server : ${err}`); // Interpolation
    }
    console.log(`Server is running on port : ${port}`);
})