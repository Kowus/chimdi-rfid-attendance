/*
let foo = {
    _id: "59adc38ea2aa13037a9320d5",
    __v: 0,
    code: 'ECE104',
    title: 'Embedded Systems',
    students: [],
    schedule:
        [{
            date: 'Wednesday, September 6th 2017, 6:16 pm',
            venue: 'LT201',
            _id: "59adc38ea2aa13037a932101"
        },
            {
                date: 'Thursday, September 7th 2017, 6:16 pm',
                venue: 'LT202',
                _id: "59adc38ea2aa13037a932100"
            },
            {
                date: 'Monday, September 11th 2017, 6:16 pm',
                venue: 'LT101',
                _id: "59adc38ea2aa13037a9320ff"
            },
            {
                date: 'Wednesday, September 13th 2017, 6:16 pm',
                venue: 'LT201',
                _id: "59adc38ea2aa13037a9320fe"
            },
            {
                date: 'Thursday, September 14th 2017, 6:16 pm',
                venue: 'LT202',
                _id: "59adc38ea2aa13037a9320fd"
            },
            {
                date: 'Monday, September 18th 2017, 6:16 pm',
                venue: 'LT101',
                _id: "59adc38ea2aa13037a9320fc"
            },
            {
                date: 'Wednesday, September 20th 2017, 6:16 pm',
                venue: 'LT201',
                _id: "59adc38ea2aa13037a9320fb"
            },
            {
                date: 'Thursday, September 21st 2017, 6:16 pm',
                venue: 'LT202',
                _id: "59adc38ea2aa13037a9320fa"
            },
            {
                date: 'Monday, September 25th 2017, 6:16 pm',
                venue: 'LT101',
                _id: "59adc38ea2aa13037a9320f9"
            },
            {
                date: 'Wednesday, September 27th 2017, 6:16 pm',
                venue: 'LT201',
                _id: "59adc38ea2aa13037a9320f8"
            }],
    lecturer: {id: "59adc36698f47103724c5da3"}
};

// console.log(foo.schedule.keys());
for (var key in foo.schedule) {
    if (foo.schedule[key].venue === "LT201") {
        console.log(key);
        foo.schedule[key].attendance = "LT201"
    }
}

console.log(foo.schedule);

var jfdi =
    {
        "title": "goodluck Dashboard",
        "user": {
            "_id": "59adc36698f47103724c5da3",
            "firstname": "Goodluck",
            "lastname": "Akimbola",
            "email": "akimbola@gmail.com",
            "password": "$2a$10$K/ylm0whqpNSnceZZunZ2O9TIuR1J43Deo4Dq.KtoR8eQFjfhqTli",
            "username": "goodluck",
            "__v": 0,
            "courses": [{"_id": "59adc38fa2aa13037a932102", "code": "ECE104"}]
        },
        "course": {"title": "Embedded Systems", "code": "ECE104"},
        "schedule": {
            "date": "Wednesday, September 6th 2017, 6:16 pm",
            "venue": "LT201",
            "_id": "59adc38ea2aa13037a932101",
            "attendance": [
                {"student_index": "ANU13230108", "student_lname": "Okon", "student_fname": "Steven", "student_id": "59af68e7a02f0006269c698c"},
                {
                "student_index": "ANU15270191",
                "student_lname": "Ihenacho",
                "student_fname": "Chimdi",
                "student_id": "59af691aa02f0006269c698e"
            }
            ]
        }
    }
;*/

let moment = require('moment');

let myMoment = moment(new Date().toISOString()).format('dddd, MMMM Do YYYY,')+" 6:16 pm";
console.log(myMoment);