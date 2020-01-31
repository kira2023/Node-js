const { Router } = require('express');
const router = Router();
const { validationResult } = require('express-validator'); 

const Course = require('../models/course');

const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    });
})

router.post('/', auth, courseValidators, async (req, res) => {
    const { title, price, img } = req.body;
    const { user:{ _id:userId } } = req;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add course',
            isAdd: true,
            data: {
                title,
                price,
                img,
            },
            error: errors.array()[0].msg
        })
    }

    // const course = new Course(title, price, img);
    const course = new Course({
        title,
        price,
        img,
        userId
    })
    try {
        await course.save();
        res.redirect('/courses');
    } catch (err) {
        console.log(err);
    }

})

module.exports = router;
