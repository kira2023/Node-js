const { Router } = require('express');
const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.getCourseById(req.body.id);
    await Card.add(course);
    res.redirect('/card');
})
router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id);
    res.json(card);
})

router.get('/', async (req, res) => {
    const { courses, price } = await Card.fetch();

    res.render('card', {
        title: 'Card',
        isCard: true,
        courses,
        price
    })
})

module.exports = router;
