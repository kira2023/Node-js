const { Router } = require('express');
const Course = require('../models/course');
const router = Router();
const { validationResult } = require('express-validator');

const auth = require('../middleware/auth');

const { courseValidators } = require('../utils/validators');

router.get('/', async (req, res) => {
    // const courses =  await Course.getAllCourses();
    const courses = await Course.find().populate('userId', 'email name');

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses: courses.map(c => c.toObject())
    })
})

router.get('/:id', async (req, res) => {
    // const course =  await Course.getCourseById(req.params.id);
    const course =  await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course: course.toObject()
    });
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    // const course =  await Course.getCourseById(req.params.id);
    const course =  await Course.findById(req.params.id);

    res.render('edit-course', {
        title: `Edit ${course.title}`,
        course: course.toObject()
    })
})

router.post('/edit', auth, courseValidators, async (req, res) => {
    const { id } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
    };

    delete req.body.id;

    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
})

router.post('/remove', auth, async (req, res) => {
    const { id:_id } = req.body;
    delete req.body.id;

    try {
        await Course.deleteOne({ _id });
        res.redirect('/courses');
    } catch(err) {
        console.log(err);
    }
})



module.exports = router;
