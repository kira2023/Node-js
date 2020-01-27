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

module.exports = router;
