const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        // Find user and estabalish the idetity
        User.findOne({email:email}, function(err, user){
            if(err){
                console.log('Error in finding the User ----->  Passport');
                return done(err);
            }

            if((!user) || user.password!=password){
                console.log('Invalid user password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
))


// Serialising the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// Deserialising the user to from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding the User ----->  Passport');
            return done(err);
        }
        return done(null, user);
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed user from the session cookie
        res.locals.user= req.user;
    }
    return next();
}

module.exports = passport;