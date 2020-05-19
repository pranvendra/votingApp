var LocalStrategy   = require('passport-local').Strategy;

var User  = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(userName, done) {
        User.findUser(userName, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, userName, password, done) {
        process.nextTick(function() {
        User.findUser( userName, function(err, user) {
            if (err){

                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                User.createUser(userName, password);
            }
        });    
        });
    }));
}