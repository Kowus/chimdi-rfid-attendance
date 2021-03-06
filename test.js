require("dotenv").config();
let mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect('mongodb://localhost/node-auth');
let Course = require('./models/courses');
let Lecturer = require('./models/lecturers');
let moment = require('moment');
let start = moment('2017-09-04T18:16:54.720Z');
let end = moment().add(14, 'w');
let req =[
{date: 1,venue:"LT101"},
    {date: 3,venue:"LT201"},
    {date: 4,venue:"LT202"}
    ];

let arr = [];
// Get "next" monday
let tmp = start.clone().day(req[0].date);
let tmp2 = start.clone().day(req[1].date);
let tmp3 = start.clone().day(req[2].date);
if (tmp.isAfter(start, 'd')) {
    // arr.push(tmp.format('YYYY-MM-DD'));
    // arr.push(tmp.format('dddd, MMMM Do YYYY, h:mm:ss a'));
    arr.push({date:tmp.format('dddd, MMMM Do YYYY, h:mm a'), venue:req[0].venue});
}
if (tmp2.isAfter(start, 'd')) {
    // arr.push(tmp2.format('YYYY-MM-DD'));
    // arr.push(tmp2.format('dddd, MMMM Do YYYY, h:mm:ss a'));
    arr.push({date:tmp2.format('dddd, MMMM Do YYYY, h:mm a'), venue:req[1].venue});
}
if (tmp3.isAfter(start, 'd')) {
    // arr.push(tmp3.format('YYYY-MM-DD'));
    // arr.push(tmp3.format('dddd, MMMM Do YYYY, h:mm:ss a'));
    arr.push({date:tmp3.format('dddd, MMMM Do YYYY, h:mm a'), venue:req[2].venue});
}
while (tmp3.isBefore(end)) {
    tmp.add(7, 'days');
    tmp2.add(7, 'days');
    tmp3.add(7, 'days');
    // arr.push(tmp.format('YYYY-MM-DD'));
    arr.push({date:tmp.format('dddd, MMMM Do YYYY, h:mm a'), venue:req[0].venue});
    // arr.push(tmp2.format('YYYY-MM-DD'));
    arr.push({date:tmp2.format('dddd, MMMM Do YYYY, h:mm a'), venue:req[1].venue});
    // arr.push(tmp3.format('YYYY-MM-DD'));
    arr.push({date:tmp3.format('dddd, MMMM Do YYYY, h:mm a'), venue:req[2].venue});
}
// console.log(arr);

let myTemp = {
    code:"ECE104",
    lecturer:{id:"59adc36698f47103724c5da3"},
    schedule:arr,
    title:"Embedded Systems",
};
// console.log(myTemp);

Course.insertMany(myTemp, function (err, docs) {
   if(err) return console.log(err);
    Lecturer.update({_id:docs[0].lecturer.id}, {
        $push: {
            courses:{
                $each:[{
                    "code":docs[0].code
                }],
                $position: 0
            }
    }}, function (err, result) {
        if(err) return console.error("Error Updating Lecturer Course Collection.");
        console.log("Updated lecturer course field");
    });
   console.log("Successfully Saved Course");
});