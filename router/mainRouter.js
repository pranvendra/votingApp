const express = require('express');
const router = express.Router();
const PollsController = require('../controllers/mainController');
const passport = require('passport')
const ensuredLogin = require('connect-ensure-login').ensureLoggedIn()
// Home page route.
router.get('/', async (req, res)=> {
    var polls = await PollsController.polls()
    res.send(polls)
})
router.get('/createTables', PollsController.createTables)
// router.post('/login', ensuredLogin ,function(req, res){
//   res.redirect('/');
// })
router.post('/createPoll', async (req, res) => {
  await PollsController.createPoll(req)
  return res.redirect('/')
})


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