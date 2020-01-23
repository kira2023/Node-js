const { Schema, model } = require('mongoose');

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String
});

module.exports = model('Course', course); // название и схема



























// const uuid = require('uuid/v4');
// const fs = require('fs');
// const path = require('path');

// class Course {
//     constructor(title, price, img) {
//         this.title = title;
//         this.price = price;
//         this.img = img;
//         this.id = uuid();
//     }

//     async save() {
//         const courses = await Course.getAllCourses();
//         courses.push(this.getNewCourse());

//         return new Promise((res, rej) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         rej(err);
//                     } else {
//                         res();
//                     }
//                 }
//             )
//         });
//     }

//     getNewCourse() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }

//     static getAllCourses() {
//         return new Promise((res, rej) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 (err, content) => {
//                     if (err) {
//                         rej(err)
//                     } else {
//                         res(JSON.parse(content));
//                     }
//                 }
//             )
//         });
//     }

//     static async getCourseById(id) {
//         const courses = await Course.getAllCourses();

//         return courses.find(c => c.id === id);
//     }

//     static async update(course) {
//         const courses = await Course.getAllCourses();
//         const idx = courses.findIndex(c => c.id === course.id);
//         courses[idx] = course;

//         return new Promise((res, rej) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         rej(err);
//                     } else {
//                         res();
//                     }
//                 }
//             )
//         });
//     }
// };

// module.exports = Course;