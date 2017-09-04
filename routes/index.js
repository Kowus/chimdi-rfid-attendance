var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
    res.json({title:"Sign Up",message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function (req, res, next) {
    res.json(req.user);
});

router.get('/login', function(req, res, next) {
    res.json({title:"Log In",message: req.flash('loginMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect:  '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect:  '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}