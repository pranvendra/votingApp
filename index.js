const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mainRouter = require('./router/mainRouter')
const methodOverride = require('method-override')
var passport = require('passport');

require('./config/passport')(passport);

var app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
//session 
var session = require("express-session")
var cookieParser = require('cookie-parser');
// var flash = require('connect-flash');
const flash = require('express-flash')

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('secret'));
app.use(session({
	secret:'happy dog',
	resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000000 }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

// var server = app.listen(PORT, 'localhost', function () {
//   var host = server.address().address
//   var port = server.address().port
//   console.log("Example app listening at http://%s:%s", host, port)
//  })


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
app.use(require('morgan')('combined'));
app.use('/', mainRouter)

app.set('view engine', 'ejs')