const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const PollsController = require('../controllers/mainController');
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const url = require('url')
const User = require('../models/User')


router.get('/', (req, res)=> {
  if (req.isAuthenticated()){
    res.redirect('/index')
  }
  res.redirect('/login')
})

router.get('/login', forwardAuthenticated, (req, res)=>{
  res.render('login', {message:req.flash('message')})
})

router.post('/login', 
  passport.authenticate('local', { 
    failureRedirect: '/login',
    failureFlash: true
   }),
  function(req, res) {
    res.redirect('/index');
  });

router.get('/index',  ensureAuthenticated, async (req, res)=> {
  var polls = await PollsController.polls(req, res)
  res.render('index',{allPolls:polls[1], myPolls:polls[0], user:req.user})
})

router.post('/createPoll', ensureAuthenticated, async (req, res) => {
  await PollsController.createPoll(req)
  return res.redirect('/')
})

router.post('/addOption', ensureAuthenticated, async (req, res) => {
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
    req.flash('message', 'vote registered')
    res.redirect(redirectUrl);
  } catch (error) {
    // req.session.error = "can only vote once"
    req.flash('message', 'only one vote allowed')
    res.redirect(redirectUrl)
  }
});

router.get('/viewPoll/:pollId', ensureAuthenticated, async(req, res)=>{
  let polls = await PollsController.viewPoll(req)
  let dynamicColor = await PollsController.createColors(polls['options'].length)
  let config = await PollsController.createConfig(dynamicColor, polls)
  return res.render('poll', {poll:polls, config:config, message:req.flash('message'), currUrl:req.url, user:req.user})
});

router.get('/getOptions/:pollId', async(req, res) => {
  let options = await PollsController.getOptions(req)
  return res.send(200, options)
});

router.delete('/poll/:pollId', async(req, res) => {
  await PollsController.removePoll(req)
  return res.redirect('/')
});
  

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register.ejs', {message:req.flash('message')})
})
  
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.createUser(req.body.userName, hashedPassword)
    res.redirect('/login')
  } catch (e){
    req.flash('message', e)
    res.redirect('/register')
  }
})



module.exports = router