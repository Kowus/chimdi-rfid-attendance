var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

// router.get('/signup', function(req, res, next) {
//     res.render("signup",{title:"Sign Up",message: req.flash('signupMessage') });
// });

router.get('/profile', isLoggedIn, function (req, res, next) {
    res.render("profile",{title:req.user.username+" Dashboard", user:req.user});
});

router.get('/login', isNotLoggedIn, function(req, res, next) {
    res.render("login",{title:"Log In",message: req.flash('loginMessage') });
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


function isNotLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        res.redirect('/profile');
    else
        return next();
}