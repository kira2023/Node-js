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
    try {
        const { email, password } = req.body;
        const session = req.session;
        const candidate = await User.findOne({ email });

        if (candidate) {
            const isSame = password === candidate.password;

            if (isSame) {
                session.user = candidate;
                session.isAuthenticated = true;
                session.save(err => {
                    if (err) throw err;
                    res.redirect('/');
                });
            } else {
                res.redirect('/auth/login#login');
            };
        } else {
            res.redirect('/auth/login#login');
        };
    } catch(err) {
        console.log(err);
    };
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
