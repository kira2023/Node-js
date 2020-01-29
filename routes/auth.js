const { Router } = require('express');
const User = require('../models/user');
const router = Router();
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { registerValidators } = require('../utils/validators');

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash('loginError'), //getter
        registerError: req.flash('registerError') //getter
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
            const isSame = await bcrypt.compare(password, candidate.password);

            if (isSame) {
                session.user = candidate;
                session.isAuthenticated = true;
                session.save(err => {
                    if (err) throw err;
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Wrong password')
                res.redirect('/auth/login#login');
            };
        } else {
            req.flash('loginError', 'Such user not exists')
            res.redirect('/auth/login#login');
        };
    } catch(err) {
        console.log(err);
    };
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body;
        const candidate = await User.findOne({ email });
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');//ошибка валидации 422
        }

        if (candidate) {
            req.flash('registerError', 'Such email exists');
            res.redirect('/auth/login#register');
        } else {
            const hashPassword = await bcrypt.hash(password, 10); //число для более сложного шифрования, чем больше строка тем сложнее взломать
            const user = new User({
                email,
                name,
                password: hashPassword,
                cart: { items: [] }
            });
            await user.save();
            res.redirect('/auth/login#login');
        };
    } catch(err) {
        console.log(err);
    };
});

module.exports = router;
