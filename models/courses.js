const mongoose = require('mongoose');
let CourseSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true
    },
    lecturer:{
        id:mongoose.Schema.Types.ObjectId
    },
    schedule:[
        {
            attendance:{
                student_id: mongoose.Schema.Types.ObjectId,
                isPresent:{
                    type: Boolean
                }
            },
            date: String,
            venue: String
        }
    ],
    title:{
        type:String,
        required:true
    },
    students:[
        {
            id: mongoose.Schema.Types.ObjectId
        }
    ], history:[{student:mongoose.Schema.Types.ObjectId, date:String}]
});

module.exports = mongoose.model("Course", CourseSchema);