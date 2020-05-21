
var passport = require("passport");
var LocalStrategy   = require('passport-local').Strategy;

var User  = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log('serialize: ' + user.userId)
        done(null, user.userName);
        // done(null, user.rows[0].userId);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        // User.findUser(id, function(err, user) {
        User.findUser(username, function(err, user) {
            console.log("Deser k baad user : ", user)
            done(err, user);
        });
    });

    
     passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    async function(req, username, password, done) {
        
        let user =  await User.findUser(username)
        console.log(user)
        if (user){
            return done(null, user);
        }  else {
            return done(null, false);
        }

        // .then((result)=> {
        //     console.log('user found.');
        //     return done(null, result);
        // })
        // .catch((err) => {
        //     console.log('user not found.');
        //     log.error("/login: " + err);
        //     return done(null, false, {message:'Wrong user name or password'});
        // });
        }));

        // passport.use(new LocalStrategy((username, password, done) =>{ 
        //     console.log(username)
        //     User.findUser(username).then((user) => {
        //         console.log(user)
        //         if (!user) return done(null, false);
        //         if (!autHelpers.comparePass(password, user.password)) {
        //             return done(null, false);
        //         } else {
        //             return done(null, user);
        //         }
        //     })
        // }));   

         //  )}));
    // passport.use('local-signup', new LocalStrategy({
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, userName, password, done) {
    //     process.nextTick(function() {
    //     User.findUser( userName, function(err, user) {
    //         if (err){

    //             return done(err);
    //         }
    //         if (user) {
    //             return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //         } else {
    //             User.createUser(userName, password);
    //         }
    //     });    
    //     });
    // }));

    }
   

// module.exports = passport;
