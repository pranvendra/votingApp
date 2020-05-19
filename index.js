const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mainRouter = require('./router/mainRouter')
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var app = express()
  // .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  // .listen(PORT, () => console.log(`Listening on ${ PORT }`))


passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));


passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
    

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


var server = app.listen(PORT, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
 })


 app.use(require('morgan')('combined'));
 app.use(require('body-parser').urlencoded({ extended: true }));
 app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
 

 app.use('/', mainRouter)
 app.use(passport.initialize());
 app.use(passport.session());
