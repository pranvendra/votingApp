const express = require('express');
const router = express.Router();
const PollsController = require('../controllers/mainController');
const passport = require('passport')
const ensuredLogin = require('connect-ensure-login').ensureLoggedIn()
const url = require('url')


function loggedIn(req, res, next) {
  console.log(req.user);
  console.log('logged in: ' + req.isAuthenticated());

  if (req.user || req.isAuthenticated() || req.method === 'OPTIONS') {
    console.log("within if");
    next();
  }
  else{ 
    console.log("outside if");
    req.session.error = 'Please sign in!';
    res.redirect('/login');
    res.status(400).send();
  }
}

// Home page route.
router.get('/', async (req, res)=> {
    var polls = await PollsController.polls()
    res.render('index',{polls:polls})
})
router.get('/polls', async (req, res)=> {
  var polls = await PollsController.polls()
  res.render('poll',{polls:polls})
})


router.get('/createTables', PollsController.createTables)
// router.post('/login', ensuredLogin ,function(req, res){
//   res.redirect('/');
// })
router.post('/createPoll', async (req, res) => {
  await PollsController.createPoll(req)
  return res.redirect('/')
})

router.post('/addOption', async (req, res) => {
  await PollsController.addOption(req)
  return res.send(200)
});

router.post('/vote', async (req, res) => {
  var redirectUrl = url.format({
    pathname:"/viewPoll/"+req.body.pollId,
  })
  if (req.body.selectOption){
    req.body.option = req.body.selectOption
    var optionId = await PollsController.addOption(req)
    req.body.optionId = optionId
  }
  try {
    await PollsController.vote(req)
    req.flash('message', 'Flash is back1232!')
    res.redirect(redirectUrl);
  } catch (error) {
    // req.session.error = "can only vote once"
    req.flash('info', 'Flash is back!')
    res.redirect(redirectUrl)
  }
});

router.get('/viewPoll/:pollId', async(req, res)=>{
  let polls = await PollsController.viewPoll(req)
  let dynamicColor = await PollsController.createColors(polls['options'].length)
  let config = await PollsController.createConfig(dynamicColor, polls)
  return res.render('poll', {poll:polls, config:config})
});

router.get('/getOptions/:pollId', async(req, res) => {
  let options = await PollsController.getOptions(req)
  return res.send(200, options)
});

router.delete('/poll/:pollId', async(req, res) => {
  await PollsController.removePoll(req)
  return res.redirect('/')
});


// router.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
  // });



  // router.post('/login', function(req,res,next){
  //   console.log("reached login endpoint");
  //   console.log(req.body);
  //   passport.authenticate('local-login', function(err, user, info){ 
  //   console.log("Test:" + user);
  //     if (err) {
  //       console.log("Error1");
  //       return next(err);
  //     }
  //     if (!user) {
  //       console.log("Error2");
  //       return res.json(401, {
  //           error: 'Auth Error!'
  //       });
  //     }
  //     console.log(user)
  //     req.logIn(user, function(err){
  //       if (err) {
  //         console.log('error on userController.js post /login logInErr', err);
  //         return next(err);
  //       }
  //       // return res.status(200).json(user[0]);
  //     console.log("Wednesday");
  //     // req.session.save(() => res.redirect('/'));
      
  //     // res.redirect(200, '/');
  //     return res.send({redirect: '/'});
  //     // return res.redirect('/');
  //     });
  //   })(req, res, next);
  // });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });


router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


module.exports = router