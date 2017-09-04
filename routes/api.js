const mongoose = require('mongoose'),
    passport = require('passport');
require('../config/passport')(passport);
let    config = require('../config/database'),
    express = require('express');
let jwt = require('jsonwebtoken'),
    router = express.Router(),
    User = require('../models/user'),
    Book = require('../models/book');



router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password'});
    } else {
        let newUser = new User({
            username: req.body.username,
            password: req.body.password,
            card: req.body.card
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

router.post('/signin', function(req, res) {
    if(!req.query.card_id) {
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
            if(err) throw err;
            if(!user){
                res.status(401).send({success:false, msg:'Invalid Card'});
            }
            else{
                let token = jwt.sign(user, config.secret);
                res.json({success: true, token: 'JWT ' + token});
            }
        });
    }
});

router.post('/signin/card/:card', (req, res, next)=>{
    User.findOne({
        card: req.params.card
    }, function (err, user) {
        if(err) throw err;
        if(!user){
            res.status(401).send({success:false, msg:'Invalid Card'});
        }
        else{
            let token = jwt.sign(user, config.secret);
            res.json({success: true, token: 'JWT ' + token});
        }
    })
});

router.post('/book', function (req, res) {
    if (req.get('Authorization')){
        jwt.verify(req.get('Authorization').split(' ')[1], config.secret, (err, decoded)=>{
            if (err) return res.status(403).send({success: false, msg: {msg: 'Unauthorized.', error: err}});
            let newBook = new Book({
                isbn: req.body.isbn,
                title: req.body.title,
                author: req.body.author,
                publisher: req.body.publisher
            });

            newBook.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Save book failed.'});
                }
                res.json({success: true, msg: 'Successful created new book.'});
            });
        });
    }
});
router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {

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