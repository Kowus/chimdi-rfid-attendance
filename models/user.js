let mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
let UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    card: {
        type: String,
        required: true
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    }, indexNumber: {
        type: String,
        required: true,
        unique: true
    }, expectedAttendance: {
        type: Number,
        default: 15
    },
    totalAttendance: {
        type: Number,
        default: 0
    }
});

UserSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);