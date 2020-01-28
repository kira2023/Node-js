const { Router } = require('express');
// const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();

const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
    const { user } = req;
    const course = await Course.findById(req.body.id);
    // await Card.add(course);
    await user.addToCart(course);
    res.redirect('/card');
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    // const card = await Card.remove(req.params.id);
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: computePrice(courses)
    }
    res.json(cart);
})

router.get('/', auth, async (req, res) => {
    // const { courses, price } = await Card.fetch();
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    const courses = mapCartItems(user.cart);
    res.render('card', {
        title: 'Card',
        isCard: true,
        courses,
        price: computePrice(courses)
    })
})

function mapCartItems(cart){
    return cart.items.map(i => ({
        ...i.courseId._doc,
        id: i.courseId.id,
        count: i.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => (
        total += course.price * course.count
    ), 0)
}
module.exports = router;
