const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    Lecturer = require('../models/lecturers'),
    config = require('./database');

module.exports = function (passport) {
    passport.serializeUser(function (req, user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (req, id, done) {
        Lecturer.findById(id, function (err, user) {
            done(err, user);
        });
    });

    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function (err, user) {
            if (err) return done(err, false);
            if (user) done(null, user);
            else done(null, false);
        })
    }));


    passport.use('local-signup', new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback:true
    }, function (req, username, password, done) {
        process.nextTick(function () {
            Lecturer.findOne({"username":username.toString().toLowerCase()}, function (err, user) {
                if (err) return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username has already been used with an account.'))
                } else {
                    //	Username doesn't already exist
                    console.log(req.body);
                    Lecturer.findOne({"email": req.body.email.toString().toLowerCase()}, function (err, uzer) {
                        if (err) return done(err);
                        if(uzer) return done(null, false, req.flash('signupMessage', 'That email has already been used with an account.'));
                        else {
                            // Email doesn't exist
                            //	Create User
                            let newLecturer = new Lecturer();

                            newLecturer.username = req.body.username;
                            newLecturer.password = req.body.password;
                            newLecturer.email = req.body.email;
                            newLecturer.lastname = req.body.lastname;
                            newLecturer.firstname = req.body.firstname;


                            //	save the user
                            newLecturer.save(function (err) {
                                if (err) throw err;
                                return done(null, newLecturer);
                            });
                        }
                    });

                }
            });
        });
    }));


    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        password: 'password',
        passReqToCallback:true
    }, function (req, username, password, done) {
        Lecturer.findOne({'username':username}, function (err, user) {
            if(err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));
            //	If user found but password is wrong
            if (!user.comparePassword(password)) return done(null, false, req.flash('loginMessage', 'Username or Password incorrect'));
            return done(null, user);
        })
    }));
};