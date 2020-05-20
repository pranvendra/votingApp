const express = require('express');
const router = express.Router();
const PollsController = require('../controllers/mainController');
const passport = require('passport')
const ensuredLogin = require('connect-ensure-login').ensureLoggedIn()

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
  return res.send(200)
})

router.post('/addOption', async (req, res) => {
  PollsController.addOption(req)
  return res.send(200)
});

router.post('/vote', async (req, res) => {
  PollsController.vote(req)
  return res.send(200)
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
  return res.send(200)
});


router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
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