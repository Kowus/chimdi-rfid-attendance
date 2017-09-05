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