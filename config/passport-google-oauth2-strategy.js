const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// Tell passport to use a new strategy for google login
passport.use(new googleStrategy(
    {
        clientID: "271865558484-mdjmr22215uq2qucbfmpn0r6jee2om10.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err) {console.log("Error in google Strategy Passport: ", err); return;}
            console.log("************");
            console.log(accessToken, refreshToken);
            console.log("#########");
            console.log(profile);
            console.log("$$$$$$$$$$$");

            if(user){
                return done(null,user);
            }
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err) {console.log("Error in google Strategy Passport: ", err); return;}

                    return done(null,user);
                });
            }

        });
    }


));

module.exports = passport;