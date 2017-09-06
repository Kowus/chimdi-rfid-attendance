var express = require('express');
var router = express.Router();
var api_key = process.env.MAILGUN_API_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
let fs = require('fs');
let css = "../public/stylesheets/bootstrap.min.css";

const passport = require('passport');
let Course = require('../models/courses'),
    User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.post('/maildata', function(req, res, next) {
    let myCss = "";
    fs.readFile('/etc/passwd', (err, data) => {
        if (err) throw err;
        // console.log(data);
        myCss = data;
    });
    let data={
        from:"Attendance Log <okonidorenyin@gmail.com>",
        to:"chimdi94@gmail.com",
        subject:`Attendance Log for ${req.body.title} on ${req.body.date}`,
        html:`<style>${myCss}</style><h1>${req.body.venue}</h1><div>${req.body.attendance}</div>`
    };
    mailgun.messages().send(data, function (error, body) {
        if(error) return res.send("Error sending mail");
        // console.log(body);
        res.redirect('/profile');
    });


});

// router.get('/signup', function(req, res, next) {
//     res.render("signup",{title:"Sign Up",message: req.flash('signupMessage') });
// });

router.get('/profile', isLoggedIn, function (req, res, next) {

    Course.findOne({code: req.user.courses[0].code}, (err, course)=>{
        if(err) console.error(err);

        res.render("profile",{title:req.user.username+" Dashboard", user:req.user, courses:course});
    });

});
router.get('/courses/get/:id',isLoggedIn, (req, res, next)=>{
    Course.findOne({"schedule._id":req.params.id}, (err, course)=>{
        if (err) return res.send("Error getting Schedule");

        let sched = course;
        let newSched = {};
        let idBatch = [];
        let newAt = [];
        for(var key in sched.schedule){
            // console.log(`Key: ${key}\t|\t value: ${sched.schedule[key]}`);

            if(sched.schedule[key]._id == req.params.id){
                newSched = sched.schedule[key];
                // console.log(newSched);
            }

        }
        // res.json({title:req.user.username+" Dashboard", user:req.user, course: {title: course.title, code: course.code }, schedule:newSched});

        res.render("course_outline",{title:req.user.username+" Dashboard", user:req.user, course: {title: course.title, code: course.code }, schedule:newSched});
    })
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