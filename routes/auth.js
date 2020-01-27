const { Router } = require('express');
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

router.post('/login', (req, res) => {
    req.session.isAuthenticated = true;
    res.redirect('/');
});

module.exports = router;
