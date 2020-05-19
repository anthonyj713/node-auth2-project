const express = require('express');

const Users = require('./users-model.js');

const router = express.Router();

router.get('/', (req, res) => {
    Users.get()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message:'There was an error retrieving the users list'
        });
    });
});

module.exports = router;