var LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var User  = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ 
            usernameField : 'userName',
            passwordField : 'password',
         }, (username, password, done) => {
          // Match user
          User.findUser(username)
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'That username is not registered' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            });
          });
        })
      );
    
    passport.serializeUser(function(user, done) {
        // console.log('serialize: ' + user.userId)
        done(null, user.userName);
        // done(null, user.rows[0].userId);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {

        User.findUser(username)
        .then((user, err) => {
            done(err, user);
        });
    });
}


