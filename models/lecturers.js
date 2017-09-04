const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
let LecturerSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },lastname:{
        type: String,
        required:true
    },
    courses:[
        {
            id: mongoose.Schema.Types.ObjectId
        }
    ],
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String
    }
});

LecturerSchema.pre('save', function (next) {
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

LecturerSchema.methods.comparePassword=function (passw) {
    return bcrypt.compareSync(passw, this.password);
};
module.exports = mongoose.model("Lecturer", LecturerSchema);