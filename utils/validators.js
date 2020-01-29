const { check } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    check('email').isEmail().withMessage('Enter correct email.').custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: value });
            if (user)  {
                return Promise.reject('Such email exists');
            }
        } catch(err) {
            console.log(err);
        }
    }),
    check('password', 'Enter correct password. It should include min 6 simbol.').isLength({ min:6, max: 56 }).isAlphanumeric(),
    check('confirm').custom((value, { req }) => {
        if(value !== req.body.password) throw new Error ('Passwords must match.');
        return true;
    }),
    check('name').isLength({ min:3 }).withMessage('Name should include min 3 simbol.')
];