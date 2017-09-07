const mongoose = require('mongoose'),
    passport = require('passport');
require('../config/passport')(passport);
let config = require('../config/database'),
    express = require('express');
let jwt = require('jsonwebtoken'),
    router = express.Router(),
    User = require('../models/user'),
    Course = require('../models/courses'),
    moment = require('moment');

// moment(Date().toISOString()).format('dddd, MMMM Do YYYY, h:mm a')
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password'});
    } else {
        let newUser = new User({
            firstname: req.body.firstname,
            lastname:req.body.lastname,
            username: req.body.username,
            password: req.body.password,
            card: req.body.card,
            indexNumber:req.body.indexNumber
        });

        newUser.save(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Username already exists'
                });
            }
            res.json({
                success: true,
                msg: 'Successfully created a new user'
            });
        })
    }
});

router.post('/signin', function (req, res) {
    if (!req.query.card_id) {
        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        let token = jwt.sign(user, config.secret);
                        // return the information including token as JSON
                        res.json({success: true, token: 'JWT ' + token});
                    } else {
                        res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                });
            }
        });
    }
    else {
        User.findOne({
            card: req.query.card_id
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.status(401).send({success: false, msg: 'Invalid Card'});
            }
            else {
                let token = jwt.sign(user, config.secret);
                res.json({success: true, token: 'JWT ' + token});
            }
        });
    }
});
// rfid-attendance.herokuapp.com/api/signin/card/?sernum=
router.get('/signin/card', (req, res, next) => {
    let pres = req.query.present == "true";
    console.log(req.query);
    User.findOne({
        card: req.query.sernum
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({success: false, msg: 'Invalid Card'});
        }
        else {

            Course.updateOne({"schedule.date":'Thursday, September 7th 2017, 6:16 pm'},{
                $push: {
                    "schedule.0.attendance":{
                        $each:[{
                            "student_id":user._id,
                            "student_fname":user.firstname,
                            "student_lname":user.lastname,
                            "student_index":user.indexNumber,
                            "student_present":pres
                        }],
                            $position: 0
                    }
                }}, function (err, course) {
                if(pres) {
                    User.updateOne({"_id": user._id}, {
                        $inc: {
                            totalAttendance: 1
                        }
                    }, function (er, usr) {
                        if (er) {
                            console.error(er);
                            return res.send("Error signing student in.");
                        }
                    });
                }
                if(err) {console.error(err);return res.send("Error signing student in.");}
                let token = jwt.sign(user, config.secret);
                res.json({success: true, token: 'JWT ' + token, course:course});
            });
            /*
            Course.findOne({"schedule.date": 'Wednesday, September 6th 2017, 6:16 pm'}, function (err, course) {
                if (err) return res.send("Error signing student in.");
                let cloneCourse = course;
                for (var key in cloneCourse.schedule) {
                    if (cloneCourse.schedule[key].date === 'Wednesday, September 6th 2017, 6:16 pm') {
                        cloneCourse.schedule[key].attendance[0]={student_id: user._id, present: true};

                        // console.log(Object.keys(cloneCourse.schedule));
                        Course.updateOne({"schedule.date":'Wednesday, September 6th 2017, 6:16 pm'},{
                            $push:{
                                "schedule.0.attendance":{

                                }
                            }
                        });
                    }

                }

                let token = jwt.sign(user, config.secret);
                res.json({success: true, token: 'JWT ' + token, course: course});
            })*/

        }
    })
});

router.post('/course/add', function (req, res) {
    // if (req.get('Authorization')){
    // jwt.verify(req.get('Authorization').split(' ')[1], config.secret, (err, decoded)=>{
    if (err) return res.status(403).send({success: false, msg: {msg: 'Unauthorized.', error: err}});
    let newCourse = new Course({
        code: req.body.code,
        title: req.body.title
    });


    newCourse.save(function (err) {
        if (err) {
            return res.json({success: false, msg: 'Save Course failed.'});
        }
        res.json({success: true, msg: 'Successful created new Course.'});
    });
    // });
    // }
});

router.get('/courses', passport.authenticate('jwt', {session: false}), function (req, res) {

    let token = getToken(req.headers);
    if (token) {
        Book.find(function (err, books) {
            if (err) return next(err);
            res.json(books);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});


let getToken = function (headers) {
    if (headers) {
        let parted = headers.split(' ');
        console.log(headers);
        if (parted.length === 2) {
            return parted[1];
        } else {
            console.log("no headers found");
            return null;
        }
    } else {
        console.log("no headers found");
        return null;
    }
};


module.exports = router;