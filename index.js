const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mainRouter = require('./router/mainRouter')

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
//session 
var session = require("express-session")
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
app.use(cookieParser('secret'));
app.use(session({
	secret:'happy dog',
	saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

const findUser = require("./models/User").findUser
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

  // .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  // .listen(PORT, () => console.log(`Listening on ${ PORT }`))

passport.use('local', new Strategy(
  function(username, password, cb) {
    findUser(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.username);
});    

passport.deserializeUser(function(id, cb) {
  findUser(username, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var server = app.listen(PORT, 'localhost', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
 })

app.use(require('morgan')('combined'));
app.use('/', mainRouter)

// app.get('/login', function(req, res){
//   res.render('login');
// });
//  app.post('/login',  passport.authenticate('local', { failureRedirect: '/logi' }),
//  function(req, res) {
//    res.redirect('/');
//  });
app.set('view engine', 'ejs')