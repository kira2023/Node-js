const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    }); //когда у нас будут уничтожены все данные сессии

    // req.session.isAuthenticated = false;
});

router.post('/login', async (req, res) => {
    const user = await User.findById('5e2aa7f0c2981a2d60929b21');

    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
        if (err) throw err;
        res.redirect('/');
    })
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            res.redirect('/auth/login#register');
        } else {
            const user = new User({
                email,
                name,
                password,
                cart: { items: []}
            });
            await user.save();
            res.redirect('/auth/login#login');
        };
    } catch(err) {
        console.log(err);
    };
});

module.exports = router;
