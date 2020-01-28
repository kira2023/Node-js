const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    });
})

router.post('/', auth, async (req, res) => {
    const { title, price, img } = req.body;
    const { user:{ _id:userId } } = req;
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
