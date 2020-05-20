const express = require('express');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const router = express.Router();

const Users = require('../users/users-model.js');

const { isValid } = require('../users/users-helper.js');

router.post('/register', (req, res) => {
    const credentials = req.body;

    if(isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        const hash = bcryptjs.hashSync(credentials.password, rounds);

        credentials.password = hash;

        Users.add(credentials)
        .then(user => {
            res.status(201).json({
                data: user
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'There was an error registering the user'
            });
        })
    } else {
        res.status(400).json({
            message: 'Please provide a username and password. The password should be alphanumeric'
        });
    };
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if(isValid(req.body)) {
        Users.findBy({ username: username })
        .then(([user]) => {
            if (user && bcryptjs.compareSync(password, user.password)) {
                const token = createToken(user);

                res.status(200).json({
                    message: "Welcome!", token
                });
            } else {
                res.status(200).json({
                    message: 'Invalid credentials'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'There was an error logging in'
            });
        })
    } else {
        res.status(400).json({
            message: 'Please provide a username and password. The password should be alphanumeric'
        });
    };
});

function createToken(user) {
    const payload = {
        sub: user.id,
        username: user.username,
        department: user.department
    };

    const secret = process.env.JWT_SECRET || 'secret';

    const options = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, secret, options);
};

module.exports = router;